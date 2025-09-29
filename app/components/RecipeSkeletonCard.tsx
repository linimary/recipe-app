export default function RecipeSkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      {/* Image placeholder */}
      <div className="h-80 w-full bg-gray-200"></div>

      {/* Card content placeholder */}
      <div className="p-6">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded mb-2"></div>

        {/* Description snippet */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>

        {/* Optional details: prep/cook time */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>

        {/* Metadata / actions placeholder */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-1">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  )
}