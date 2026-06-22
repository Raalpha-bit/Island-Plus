import { ReactNode } from 'react';
import CreatorHeader from '@/components/creator/CreatorHeader';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default async function CreatorLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return (
    <div className="min-h-screen bg-black-deep">
      <Navbar />
      <main className="pt-16 lg:pt-18 pb-20">
        <CreatorHeader username={username} />
        {children}
      </main>
      <Footer />
    </div>
  );
}
