import { getAllTopics, getLessonsByTopicSlug } from '../../../../../lib/data';
import LessonPageClient from './LessonPageClient';

export async function generateStaticParams() {
  const topics = getAllTopics();
  const params: { topicSlug: string; lessonSlug: string }[] = [];
  
  for (const topic of topics) {
    const lessons = getLessonsByTopicSlug(topic.slug);
    for (const lesson of lessons) {
      params.push({
        topicSlug: topic.slug,
        lessonSlug: lesson.slug,
      });
    }
  }
  
  return params;
}

export default function LessonPage({ params }: { params: Promise<{ topicSlug: string; lessonSlug: string }> }) {
  return <LessonPageClient params={params} />;
}
