import { redirect } from 'next/navigation';

export default function SearchPage() {
  // Simple redirect to explore page for now, as it contains the search functionality
  redirect('/explore');
}
