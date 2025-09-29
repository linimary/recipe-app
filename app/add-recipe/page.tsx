'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const recipeSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    imageUrl: z.string().url('Must be a valid URL'),
    category: z.string().min(1, 'Category is required'),
    prepTime: z.string().min(1, 'Prep time is required'),
    cookTime: z.string().min(1, 'Cook time is required'),
    content: z.string().min(20, 'Recipe instructions must be at least 20 characters')
})

type RecipeFormData = z.infer<typeof recipeSchema>

export default function AddRecipe() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')

    const { register, handleSubmit, formState: { errors }, reset } = useForm<RecipeFormData>({
        resolver: zodResolver(recipeSchema)
    })

    if (status === 'loading') {
        return (
            <div className="min-h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!session) {
        router.push('/auth/signin')
        return null
    }

    const onSubmit = async (data: RecipeFormData) => {
        setIsSubmitting(true)
        setSubmitError('')

        try {
            const response = await fetch('/api/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, authorId: session.user.id }),
                credentials: 'include'
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to add recipe')
            }

            const newRecipe = await response.json()
            reset()
            router.push(`/recipes/${newRecipe.slug}`)
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-green-50 via-white to-yellow-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center text-3xl text-white mb-6 animate-bounce-in">
                            🍲
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Add New Recipe
                        </h1>
                        <p className="text-lg text-gray-600">
                            Share your delicious recipe with our community
                        </p>
                    </div>

                    <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input {...register('title')} type="text" id="title" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500" />
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea {...register('description')} id="description" rows={2} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500" />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input {...register('imageUrl')} type="url" id="imageUrl" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="https://example.com/recipe.jpg" />
                                {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <input {...register('category')} type="text" id="category" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g. Dessert, Salad" />
                                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-1">Prep Time</label>
                                <input {...register('prepTime')} type="text" id="prepTime" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g. 15 mins" />
                                {errors.prepTime && <p className="mt-1 text-sm text-red-600">{errors.prepTime.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 mb-1">Cook Time</label>
                                <input {...register('cookTime')} type="text" id="cookTime" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g. 30 mins" />
                                {errors.cookTime && <p className="mt-1 text-sm text-red-600">{errors.cookTime.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Recipe Instructions</label>
                                <textarea {...register('content')} id="content" rows={6} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500" />
                                {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
                            </div>

                            {submitError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-sm text-red-700">{submitError}</p>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-green-500 to-yellow-500 text-white py-3 rounded-lg hover:from-green-600 hover:to-yellow-600 transition-all duration-200 shadow-lg">
                                    {isSubmitting ? 'Adding Recipe...' : 'Add Recipe'}
                                </button>
                                <button type="button" onClick={() => router.push('/')} className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-lg">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
