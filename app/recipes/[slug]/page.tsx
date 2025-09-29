import { notFound } from 'next/navigation'
import { getRecipeBySlug } from '@/app/lib/data'
import type { Metadata } from 'next'
import RecipeDetailClient from './RecipeDetailClient'
import { Recipe } from '@/app/lib/data'

interface RecipePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { slug } = params
  const recipe = getRecipeBySlug(slug)

  if (!recipe) {
    return {
      title: 'Recipe Not Found',
      description: 'This recipe does not exist.',
    }
  }

  return {
    title: `${recipe.title} - Recipe Book`,
    description: recipe.description,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      images: [recipe.imageUrl],
    },
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = params
  const recipe: Recipe | undefined = getRecipeBySlug(slug)

  if (!recipe) {
    notFound()
  }

  return <RecipeDetailClient recipe={recipe} />
}
