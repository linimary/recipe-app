'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Favorites() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status !== 'loading' && !session) {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center py-20">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-orange-600 rounded-full flex items-center justify-center text-4xl text-white mb-4">
            🥙
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Favorites Yet</h3>
          <p className="text-gray-600 text-lg mb-6">
            Start adding recipes to your favorites to see them here!
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-green-600 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Browse Recipes
          </button>
        </div>
      </div>
    </div>
  )
}

