import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { getRecipes, addRecipe } from '@/app/lib/data'
import { z } from 'zod'

const recipeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  prepTime: z.string().optional(),
  cookTime: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')

    let recipes = getRecipes()

    if (search) {
      recipes = recipes.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.content.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category) {
      recipes = recipes.filter(r => r.category.toLowerCase() === category.toLowerCase())
    }

    return NextResponse.json(recipes)
  } catch (error) {
    console.error('GET /api/recipes error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to add recipes' },
        { status: 401 }
      )
    }

    if (session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validation = recipeSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      )
    }

    const newRecipe = addRecipe({
      ...validation.data,
      prepTime: validation.data.prepTime ? Number(validation.data.prepTime) : undefined,
      cookTime: validation.data.cookTime ? Number(validation.data.cookTime) : undefined,
      authorId: session.user.id,
      createdAt: new Date().toISOString()
    })

    return NextResponse.json(newRecipe, { status: 201 })
  } catch (error) {
    console.error('POST /api/recipes error:', error)
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    )
  }
}
