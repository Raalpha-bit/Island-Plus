import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const otherUserId = searchParams.get('userId');

    // Case 1: Fetch messages between current user and another user
    if (otherUserId) {
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          receiver_id,
          body,
          media_url,
          is_read,
          tip_amount,
          created_at
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Mark received messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('receiver_id', user.id)
        .eq('sender_id', otherUserId)
        .eq('is_read', false);

      return NextResponse.json(messages);
    }

    // Case 2: Fetch list of active conversations
    // We get all messages involving the user, order by created_at desc
    const { data: chats, error } = await supabase
      .from('messages')
      .select(`
        id,
        sender_id,
        receiver_id,
        body,
        media_url,
        is_read,
        tip_amount,
        created_at,
        sender:profiles!messages_sender_id_fkey(id, username, display_name, avatar_url),
        receiver:profiles!messages_receiver_id_fkey(id, username, display_name, avatar_url)
      `)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Deduplicate to show the latest message per unique contact
    const conversationsMap = new Map();

    for (const msg of chats || []) {
      const isSender = msg.sender_id === user.id;
      const contact = isSender ? msg.receiver : msg.sender;
      if (!contact) continue;

      if (!conversationsMap.has(contact.id)) {
        conversationsMap.set(contact.id, {
          contact: {
            id: contact.id,
            username: contact.username,
            displayName: contact.display_name,
            avatar: contact.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
          },
          lastMessage: {
            body: msg.body,
            createdAt: msg.created_at,
            senderId: msg.sender_id,
            isRead: msg.is_read,
          }
        });
      }
    }

    return NextResponse.json(Array.from(conversationsMap.values()));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId, text, mediaUrl, tipAmount } = body;

    if (!receiverId || (!text && !mediaUrl)) {
      return NextResponse.json({ error: 'Missing receiverId or content' }, { status: 400 });
    }

    // Insert message
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: receiverId,
        body: text || '',
        media_url: mediaUrl || null,
        tip_amount: tipAmount ? Number(tipAmount) : null
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If tip is included, create a transaction & credit the receiver
    if (tipAmount && Number(tipAmount) > 0) {
      const amount = Number(tipAmount);
      const fee = amount * 0.2; // 20%
      const net = amount - fee;

      // Start transaction
      await supabase.from('transactions').insert({
        user_id: user.id,
        creator_id: receiverId,
        type: 'tip',
        status: 'completed',
        amount,
        platform_fee: fee,
        net_amount: net,
        description: `Tip from message`
      });

      // Update creator balance
      await supabase.rpc('increment_wallet_balance', {
        user_uuid: receiverId,
        amount_to_add: net
      });
    }

    return NextResponse.json(message);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
