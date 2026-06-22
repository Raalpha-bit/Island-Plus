import { redirect } from 'next/navigation';

export default async function CreatorPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  redirect(`/creator/${username}/home`);
}
