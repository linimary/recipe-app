import { notFound } from 'next/navigation'
import { getRecipes, getRecipeById } from '../../lib/data'
import type { Metadata } from 'next'
import RecipeDetailClient from './RecipeDetailClient'
import { Recipe } from '@/app/lib/data'

interface RecipePageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  const recipes = getRecipes()
  return recipes.map((recipe: Recipe) => ({
    id: recipe.id,
  }))
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { id } = await params
  const recipe = getRecipeById(id)

  if (!recipe) {
    return {
      title: 'Recipe Not Found',
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
  const { id } = await params
  const recipe = getRecipeById(id)

  if (!recipe) {
    notFound()
  }

  return <RecipeDetailClient recipe={recipe} />
}
