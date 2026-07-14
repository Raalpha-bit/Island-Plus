-- =============================================
-- ISLAND+ — Supabase Database Schema
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE user_role AS ENUM ('member', 'creator', 'admin');
CREATE TYPE subscription_tier AS ENUM ('bronze', 'silver', 'gold', 'black');
CREATE TYPE content_type AS ENUM ('image', 'video', 'audio', 'text');
CREATE TYPE transaction_type AS ENUM ('subscription', 'tip', 'withdrawal', 'refund', 'payout');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE notification_type AS ENUM ('new_subscriber', 'new_like', 'new_comment', 'new_message', 'new_tip', 'payout_sent', 'system');

-- =============================================
-- PROFILES (extends auth.users)
-- =============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  role user_role NOT NULL DEFAULT 'member',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  country TEXT DEFAULT NULL,
  date_of_birth DATE DEFAULT NULL,
  wallet_balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  stripe_customer_id TEXT UNIQUE DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- CREATORS (extended profile for creators)
-- =============================================

CREATE TABLE creators (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'Lifestyle',
  cover_url TEXT DEFAULT NULL,
  total_followers INTEGER NOT NULL DEFAULT 0,
  total_subscribers INTEGER NOT NULL DEFAULT 0,
  total_posts INTEGER NOT NULL DEFAULT 0,
  total_likes INTEGER NOT NULL DEFAULT 0,
  total_earnings DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  is_live BOOLEAN NOT NULL DEFAULT false,
  is_online BOOLEAN NOT NULL DEFAULT false,
  social_links JSONB DEFAULT '[]'::jsonb,
  stripe_account_id TEXT UNIQUE DEFAULT NULL,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  verification_docs JSONB DEFAULT NULL,
  -- Subscription tier prices
  price_bronze DECIMAL(8,2) DEFAULT 4.99,
  price_silver DECIMAL(8,2) DEFAULT 9.99,
  price_gold DECIMAL(8,2) DEFAULT 19.99,
  price_black DECIMAL(8,2) DEFAULT 49.99,
  -- Tier features
  features_bronze TEXT[] DEFAULT ARRAY['Exclusive posts', 'Community access'],
  features_silver TEXT[] DEFAULT ARRAY['Exclusive posts', 'Stories', 'Community access', 'Direct messages'],
  features_gold TEXT[] DEFAULT ARRAY['All Silver perks', 'Live streams', 'Behind the scenes', 'Priority replies'],
  features_black TEXT[] DEFAULT ARRAY['Everything included', 'VIP access', 'Priority interaction', '1-on-1 sessions', 'Custom content'],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- POSTS
-- =============================================

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  title TEXT DEFAULT NULL,
  body TEXT DEFAULT NULL,
  media JSONB DEFAULT '[]'::jsonb, -- [{type, url, thumbnail, width, height}]
  required_tier subscription_tier DEFAULT NULL, -- NULL = free for all subscribers
  is_free_preview BOOLEAN NOT NULL DEFAULT false,
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  views_count INTEGER NOT NULL DEFAULT 0,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- SUBSCRIPTIONS
-- =============================================

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscriber_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL DEFAULT 'bronze',
  stripe_subscription_id TEXT UNIQUE DEFAULT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active, cancelled, past_due, trialing
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  cancelled_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(subscriber_id, creator_id)
);

-- =============================================
-- LIKES
-- =============================================

CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- =============================================
-- COMMENTS
-- =============================================

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE DEFAULT NULL,
  body TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- MESSAGES (Direct Messages)
-- =============================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  media_url TEXT DEFAULT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  tip_amount DECIMAL(8,2) DEFAULT NULL, -- Tip included with message
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- FOLLOWS (free follows, different from subscriptions)
-- =============================================

CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(follower_id, creator_id)
);

-- =============================================
-- TRANSACTIONS
-- =============================================

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES creators(id) ON DELETE SET NULL,
  type transaction_type NOT NULL,
  status transaction_status NOT NULL DEFAULT 'pending',
  amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- Island+ takes 20%
  net_amount DECIMAL(10,2) NOT NULL, -- Amount creator receives
  currency TEXT NOT NULL DEFAULT 'USD',
  stripe_payment_intent_id TEXT UNIQUE DEFAULT NULL,
  description TEXT DEFAULT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- WITHDRAWAL REQUESTS
-- =============================================

CREATE TABLE withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, paid
  stripe_transfer_id TEXT UNIQUE DEFAULT NULL,
  payout_method TEXT NOT NULL DEFAULT 'bank_transfer',
  notes TEXT DEFAULT NULL,
  processed_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- NOTIFICATIONS
-- =============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link TEXT DEFAULT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- STORIES (24h ephemeral content)
-- =============================================

CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type content_type NOT NULL DEFAULT 'image',
  views_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES (Performance)
-- =============================================

CREATE INDEX idx_posts_creator_id ON posts(creator_id);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_subscriptions_subscriber_id ON subscriptions(subscriber_id);
CREATE INDEX idx_subscriptions_creator_id ON subscriptions(creator_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id, is_read);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_creator_id ON transactions(creator_id);
CREATE INDEX idx_follows_creator ON follows(creator_id);
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_stories_creator ON stories(creator_id, expires_at);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_creators_updated_at BEFORE UPDATE ON creators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role user_role := 'member';
BEGIN
  IF NEW.raw_user_meta_data->>'role' = 'creator' THEN
    v_role := 'creator';
  ELSIF NEW.raw_user_meta_data->>'role' = 'admin' THEN
    v_role := 'admin';
  END IF;

  INSERT INTO profiles (id, username, display_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    v_role
  );

  IF v_role = 'creator' THEN
    INSERT INTO creators (id) VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update likes count on posts
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    UPDATE creators SET total_likes = total_likes + 1 WHERE id = (SELECT creator_id FROM posts WHERE id = NEW.post_id);
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
    UPDATE creators SET total_likes = GREATEST(total_likes - 1, 0) WHERE id = (SELECT creator_id FROM posts WHERE id = OLD.post_id);
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- Update comments count on posts
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_comment_change
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- Update subscriber count on creators
CREATE OR REPLACE FUNCTION update_creator_subscriber_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE creators SET total_subscribers = total_subscribers + 1 WHERE id = NEW.creator_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE creators SET total_subscribers = GREATEST(total_subscribers - 1, 0) WHERE id = OLD.creator_id;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_subscription_change
  AFTER INSERT OR DELETE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_creator_subscriber_count();

-- Update follower count on creators
CREATE OR REPLACE FUNCTION update_creator_follower_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE creators SET total_followers = total_followers + 1 WHERE id = NEW.creator_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE creators SET total_followers = GREATEST(total_followers - 1, 0) WHERE id = OLD.creator_id;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_follow_change
  AFTER INSERT OR DELETE ON follows
  FOR EACH ROW EXECUTE FUNCTION update_creator_follower_count();

-- Update post count on creators
CREATE OR REPLACE FUNCTION update_creator_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE creators SET total_posts = total_posts + 1 WHERE id = NEW.creator_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE creators SET total_posts = GREATEST(total_posts - 1, 0) WHERE id = OLD.creator_id;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_post_change
  AFTER INSERT OR DELETE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_creator_post_count();

-- Function to safely increment user wallet balance (for payouts / tips)
CREATE OR REPLACE FUNCTION increment_wallet_balance(user_uuid UUID, amount_to_add DECIMAL(10,2))
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET wallet_balance = wallet_balance + amount_to_add
  WHERE id = user_uuid;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Profiles are publicly readable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- CREATORS
CREATE POLICY "Creators are publicly readable" ON creators FOR SELECT USING (true);
CREATE POLICY "Creator can update own profile" ON creators FOR UPDATE USING (auth.uid() = id);

-- POSTS: Free previews visible to all; paid content only for subscribers
CREATE POLICY "Free posts are public" ON posts FOR SELECT
  USING (
    is_free_preview = true
    OR required_tier IS NULL
    OR auth.uid() = creator_id
    OR EXISTS (
      SELECT 1 FROM subscriptions s
      WHERE s.subscriber_id = auth.uid()
        AND s.creator_id = posts.creator_id
        AND s.status = 'active'
        AND (
          required_tier IS NULL
          OR (required_tier = 'bronze' AND s.tier IN ('bronze','silver','gold','black'))
          OR (required_tier = 'silver' AND s.tier IN ('silver','gold','black'))
          OR (required_tier = 'gold' AND s.tier IN ('gold','black'))
          OR (required_tier = 'black' AND s.tier = 'black')
        )
    )
  );
CREATE POLICY "Creators can insert posts" ON posts FOR INSERT
  WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update own posts" ON posts FOR UPDATE
  USING (auth.uid() = creator_id);
CREATE POLICY "Creators can delete own posts" ON posts FOR DELETE
  USING (auth.uid() = creator_id);

-- SUBSCRIPTIONS
CREATE POLICY "Users can see own subscriptions" ON subscriptions FOR SELECT
  USING (auth.uid() = subscriber_id OR auth.uid() = creator_id);
CREATE POLICY "Users can subscribe" ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = subscriber_id);
CREATE POLICY "Service role manages subscriptions" ON subscriptions FOR UPDATE
  USING (true);

-- LIKES
CREATE POLICY "Likes are public" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can like" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON likes FOR DELETE USING (auth.uid() = user_id);

-- COMMENTS
CREATE POLICY "Comments are public" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update comments" ON comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete comments" ON comments FOR DELETE USING (auth.uid() = author_id);

-- MESSAGES
CREATE POLICY "Users can see own messages" ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- FOLLOWS
CREATE POLICY "Follows are public" ON follows FOR SELECT USING (true);
CREATE POLICY "Users can follow" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- TRANSACTIONS
CREATE POLICY "Users can see own transactions" ON transactions FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = creator_id);

-- WITHDRAWAL REQUESTS
CREATE POLICY "Creators can see own withdrawals" ON withdrawal_requests FOR SELECT
  USING (auth.uid() = creator_id);
CREATE POLICY "Creators can request withdrawal" ON withdrawal_requests FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- NOTIFICATIONS
CREATE POLICY "Users see own notifications" ON notifications FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- STORIES
CREATE POLICY "Active stories are public" ON stories FOR SELECT
  USING (expires_at > NOW());
CREATE POLICY "Creators can post stories" ON stories FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Create storage buckets (run in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('posts', 'posts', false); -- private, access via signed URLs
-- INSERT INTO storage.buckets (id, name, public) VALUES ('stories', 'stories', true);

-- Storage policies for avatars (public)
-- CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
-- CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for posts (private, signed URLs)
-- CREATE POLICY "Users can view subscribed content" ON storage.objects FOR SELECT
--   USING (bucket_id = 'posts' AND auth.role() = 'authenticated');
-- CREATE POLICY "Creators can upload post media" ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);
