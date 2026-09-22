import { getAllTopics } from '../../../lib/data';
import TopicPageClient from './TopicPageClient';

export async function generateStaticParams() {
  const topics = getAllTopics();
  return topics.map((topic) => ({
    topicSlug: topic.slug,
  }));
}

export default function TopicPage({ params }: { params: Promise<{ topicSlug: string }> }) {
  return <TopicPageClient params={params} />;
}
