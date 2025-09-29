'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Recipe, getUserRecipeRating } from '../../lib/data'

interface RecipeDetailClientProps {
    recipe: Recipe
}

interface UserRating {
    rating: number
    review?: string
}

export default function RecipeDetailClient({ recipe }: RecipeDetailClientProps) {
    const { data: session } = useSession()
    const router = useRouter()
    const [isFavorited, setIsFavorited] = useState(false)
    const [userRating, setUserRating] = useState<UserRating | null>(null)
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [newRating, setNewRating] = useState(5)
    const [newReview, setNewReview] = useState('')

    const checkFavoriteStatus = useCallback(async () => {
        if (!session?.user?.id) return
        try {
            const res = await fetch('/api/favorites')
            const favorites: Recipe[] = await res.json()
            setIsFavorited(favorites.some(f => f.id === recipe.id))
        } catch (error) {
            console.error('Failed to check favorite status', error)
        }
    }, [recipe.id, session?.user?.id])

    const checkUserRating = useCallback(async () => {
        if (!session?.user?.id) return
        try {
            const res = await fetch(`/api/ratings?recipeId=${recipe.id}`)
            const rating: UserRating | null = await res.json()
            setUserRating(rating)
        } catch (error) {
            console.error('Failed to check user rating', error)
        }
    }, [recipe.id, session?.user?.id])

    useEffect(() => {
        if (session?.user?.id) {
            checkFavoriteStatus()
            checkUserRating()
        }
    }, [session, checkFavoriteStatus, checkUserRating])

    const toggleFavorite = async () => {
        if (!session) {
            router.push('/auth/signin')
            return
        }
        setLoading(true)
        try {
            const res = await fetch('/api/favorites', {
                method: isFavorited ? 'DELETE' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipeId: recipe.id }),
                credentials: 'include'
            })
            if (res.ok) setIsFavorited(!isFavorited)
        } catch (error) {
            console.error('Failed to toggle favorite', error)
        } finally {
            setLoading(false)
        }
    }

    const submitRating = async () => {
        if (!session) {
            router.push('/auth/signin')
            return
        }
        setLoading(true)
        try {
            const res = await fetch('/api/ratings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipeId: recipe.id,
                    rating: newRating,
                    review: newReview.trim() || undefined,
                }),
                credentials: 'include'
            })

            if (res.ok) {
                // const updatedRating = await res.json()
                // setUserRating(updatedRating)
                setUserRating({
                rating: newRating,
                review: newReview.trim() || undefined
            })
                setIsRatingModalOpen(false)
                setNewRating(5)
                setNewReview('')
            } else {
                const errorData = await res.json()
                console.error('Rating submission failed:', errorData.error)
            }
        } catch (error) {
            console.error('Failed to submit rating', error)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-8">
                <Link href="/" className="inline-flex items-center text-green-600 hover:text-orange-600 mb-8 transition-all duration-200">
                    ← Back to Recipes
                </Link>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-in-up">
                    <div className="lg:flex">
                        <div className="relative w-full overflow-hidden" style={{ paddingTop: '35%' }}>
                            <Image
                                src={recipe.imageUrl}
                                alt={recipe.title}
                                fill
                                className="object-cover rounded-xl"
                                unoptimized
                            />
                        </div>
                        <div className="lg:w-3/5 p-8 lg:p-12">
                            <h1 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-500 mb-6">
                                {recipe.title}
                            </h1>
                            <p className="text-gray-700 leading-relaxed text-lg mb-6">{recipe.content}</p>

                            {/* Recipe Times */}
                            {(recipe.prepTime || recipe.cookTime) && (
                                <div className="mb-6 text-gray-700 text-sm">
                                    {recipe.prepTime && <>Prep: {recipe.prepTime} min</>}
                                    {recipe.cookTime && <> • Cook: {recipe.cookTime} min</>}
                                </div>
                            )}

                            {/* User Rating */}
                            {userRating && (
                                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <span className="text-yellow-500 mr-2">⭐</span>
                                        <span className="font-medium">Your Rating: {userRating.rating}/5</span>
                                    </div>
                                    {userRating.review && <p className="text-gray-700 italic">&quot;{userRating.review}&quot;</p>}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <button
                                    onClick={toggleFavorite}
                                    disabled={loading}
                                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${isFavorited
                                        ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700'
                                        : 'bg-gradient-to-r from-green-600 to-yellow-500 text-white hover:from-green-700 hover:to-yellow-600'
                                        }`}
                                >
                                    {loading ? '⏳' : isFavorited ? '💖 Favorited' : '⭐ Favorite'}
                                </button>

                                <button
                                    onClick={() => {
                                        if (!session?.user?.id) {
                                            router.push('/auth/signin')
                                            return
                                        }
                                        setIsRatingModalOpen(true)
                                    }}
                                    className="flex-1 bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600 transition-all duration-200 font-medium"
                                >
                                    {userRating ? '✏️ Edit Rating' : '⭐ Rate'}
                                </button>


                            </div>
                        </div>
                    </div>
                </div>

                {/* Rating Modal */}
                {isRatingModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold mb-4">Rate {recipe.title}</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Rating</label>

                                <div className="flex space-x-1 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setNewRating(star)}
                                            className="text-2xl text-yellow-500"
                                        >
                                            {star <= newRating ? "⭐" : "☆"}
                                        </button>
                                    ))}
                                </div>

                                <p className="text-sm text-gray-600">{newRating}/5 stars</p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Review (Optional)</label>
                                <textarea
                                    value={newReview}
                                    onChange={(e) => setNewReview(e.target.value)}
                                    placeholder="Share your thoughts..."
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    maxLength={500}
                                />
                                <p className="text-xs text-gray-500 mt-1">{newReview.length}/500 characters</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={submitRating}
                                    disabled={loading}
                                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Submitting...' : 'Submit Rating'}
                                </button>
                                <button
                                    onClick={() => setIsRatingModalOpen(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
