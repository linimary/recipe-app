import Link from 'next/link'
import Image from 'next/image'
import { Recipe } from '../lib/data'

interface RecipeCardProps {
  recipe: Recipe
  showCategoryBadge?: boolean
}

export default function RecipeCard({ recipe, showCategoryBadge = true }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
        {/* Recipe Image */}
        <div className="relative h-80 w-full overflow-hidden">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {showCategoryBadge && recipe.category && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-800">
              {recipe.category}
            </div>
          )}
        </div>

        {/* Recipe Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-yellow-600 transition-all duration-300 line-clamp-2 mb-2">
            {recipe.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {recipe.description}
          </p>

          {/* Optional metadata */}
          <div className="mt-4 flex items-center justify-between">
            {recipe.prepTime || recipe.cookTime ? (
              <div className="text-sm text-gray-700">
                {recipe.prepTime && <>Prep: {recipe.prepTime} min</>}
                {recipe.cookTime && <> • Cook: {recipe.cookTime} min</>}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No time info</div>
            )}
            <div className="text-sm text-green-600 font-medium group-hover:text-yellow-600 transition-colors">
              View Details →
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}