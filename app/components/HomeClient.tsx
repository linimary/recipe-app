'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import RecipeCard from './RecipeCard'
import RecipeSkeletonCard from './RecipeSkeletonCard'
import { Recipe } from '../lib/data'

interface HomeClientProps {
  initialRecipes: Recipe[]
  availableCategories: string[]
}

export default function HomeClient({ initialRecipes, availableCategories }: HomeClientProps) {
  const { data: session } = useSession()

  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchRecipes = async (search?: string, category?: string | null) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (category) params.append('category', category)

      const response = await fetch(`/api/recipes?${params.toString()}`)
      const data = await response.json()
      setRecipes(data)
    } catch (error) {
      console.error('Failed to fetch recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchRecipes(searchTerm, selectedCategory)
  }

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category)
    fetchRecipes(searchTerm, category)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory(null)
    setRecipes(initialRecipes)
  }

  const filteredRecipesCount = recipes.length
  const isFiltered = searchTerm || selectedCategory

  return (
    <div className="min-h-full bg-gradient-to-br from-yellow-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-yellow-600 to-orange-600">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 via-yellow-600/90 to-orange-600/90"></div>
        <div className="relative container mx-auto px-4 py-16 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            🍲 Recipe Book
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Discover delicious recipes, explore new cuisines, and add your favorites to your personal collection.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-white font-medium">
              ✨ {initialRecipes.length} Recipes Available
            </div>
            {session?.user?.role === 'admin' && (
              <div className="bg-green-500/20 backdrop-blur-sm rounded-full px-6 py-2 text-white font-medium">
                👑 Admin Access
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto space-y-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Recipes
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by recipe name or ingredients..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <div className="flex-1 sm:max-w-xs">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Category
                </label>
                <select
                  id="category"
                  value={selectedCategory || ''}
                  onChange={(e) => handleCategoryFilter(e.target.value || null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                >
                  <option value="">All Categories</option>
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-yellow-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? 'Searching...' : '🔍 Search'}
                </button>
                {isFiltered && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="w-full sm:w-auto bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {isFiltered && (
              <div className="mt-4 text-center text-sm text-gray-600">
                {filteredRecipesCount} recipe{filteredRecipesCount !== 1 ? 's' : ''} found
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory && ` in ${selectedCategory}`}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => <RecipeSkeletonCard key={i} />)}
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {recipes.map((recipe, i) => (
              <div key={recipe.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {isFiltered ? 'No Recipes Found' : 'No Recipes Yet'}
            </h3>
            <p className="text-gray-600 text-lg">
              {isFiltered ? 'Try adjusting your search terms or filters' : 'Be the first to add a recipe!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}