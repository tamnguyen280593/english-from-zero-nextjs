import { getAllTopics, getLessonsByTopicSlug, getAllCategories } from '../../../../../lib/data';
import LessonPageClient from './LessonPageClient';

export async function generateStaticParams() {
  const topics = getAllTopics();
  const categories = getAllCategories();
  const params: { categorySlug: string; topicSlug: string; lessonSlug: string }[] = [];
  
  for (const topic of topics) {
    const category = categories.find(c => c.id === topic.categoryId);
    const catSlug = category ? category.slug : 'unknown';
    const lessons = getLessonsByTopicSlug(topic.slug);
    
    for (const lesson of lessons) {
      params.push({
        categorySlug: catSlug,
        topicSlug: topic.slug,
        lessonSlug: lesson.slug,
      });
    }
  }
  
  return params;
}

export default function LessonPage({ params }: { params: Promise<{ categorySlug: string; topicSlug: string; lessonSlug: string }> }) {
  return <LessonPageClient params={params} />;
}
