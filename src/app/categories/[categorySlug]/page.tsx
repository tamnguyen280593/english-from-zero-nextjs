import { getAllCategories } from '../../../lib/data';
import CategoryPageClient from './CategoryPageClient';

// This function generates the static paths for all categories
export async function generateStaticParams() {
  const categories = getAllCategories();
  
  return categories.map((cat) => ({
    categorySlug: cat.slug,
  }));
}

interface CategoryPageProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Pass the unwrapped params to the Client Component
  return <CategoryPageClient params={params} />;
}
