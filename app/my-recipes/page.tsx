'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Recipe, getRecipes } from '../lib/data'
import RecipeCard from '../components/RecipeCard'

export default function MyRecipesPage() {
  const { data: session } = useSession()
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    if (session?.user?.id) {
      const allRecipes = getRecipes()
      const myRecipes = allRecipes.filter(r => r.authorId === session.user.id)
      setUserRecipes(myRecipes)
    }
  }, [session])

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        <p>
          You need to <Link href="/auth/signin" className="text-green-500 underline">sign in</Link> to view your recipes.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Recipes</h1>
        {userRecipes.length === 0 ? (
          <p className="text-gray-700">
            You haven’t added any recipes yet. <Link href="/add-recipe" className="text-green-500 underline">Add a new recipe</Link>.
          </p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {userRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
