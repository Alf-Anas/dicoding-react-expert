import ThreadsDetailPage from '@/containers/ThreadsPage/DetailPage';

export default function Home({ params }: { params: { id: string } }) {
  return <ThreadsDetailPage threadId={params.id} />;
}
