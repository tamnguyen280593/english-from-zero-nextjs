import { getAllTopics, getAllCategories } from '../../../../lib/data';
import TopicPageClient from './TopicPageClient';

export async function generateStaticParams() {
  const topics = getAllTopics();
  const categories = getAllCategories();
  
  return topics.map((topic) => {
    const category = categories.find(c => c.id === topic.categoryId);
    return {
      categorySlug: category ? category.slug : 'unknown',
      topicSlug: topic.slug,
    };
  });
}

export default function TopicPage({ params }: { params: Promise<{ categorySlug: string, topicSlug: string }> }) {
  return <TopicPageClient params={params} />;
}
