import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { addToFavorites, removeFromFavorites, getFavoriteRecipes } from '@/app/lib/data'

interface FavoriteRequestBody {
  recipeId: string
}

// GET: fetch favorite recipes for the logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized - Please sign in' }, { status: 401 })
    }

    const favoriteRecipes = getFavoriteRecipes(session.user.id)
    return NextResponse.json(favoriteRecipes)
  } catch (error) {
    console.error('GET /favorites error:', error)
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
  }
}

// POST: add a recipe to favorites
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized - Please sign in' }, { status: 401 })
    }

    const body: FavoriteRequestBody = await request.json()

    if (!body.recipeId) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 })
    }

    const success = addToFavorites(session.user.id, body.recipeId)
    if (!success) {
      return NextResponse.json(
        { error: 'Recipe already in favorites or not found' },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: 'Added to favorites successfully' })
  } catch (error) {
    console.error('POST /favorites error:', error)
    return NextResponse.json({ error: 'Failed to add to favorites' }, { status: 500 })
  }
}

// DELETE: remove a recipe from favorites
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized - Please sign in' }, { status: 401 })
    }

    const body: FavoriteRequestBody = await request.json()

    if (!body.recipeId) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 })
    }

    const success = removeFromFavorites(session.user.id, body.recipeId)
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to remove from favorites' },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: 'Removed from favorites successfully' })
  } catch (error) {
    console.error('DELETE /favorites error:', error)
    return NextResponse.json({ error: 'Failed to remove from favorites' }, { status: 500 })
  }
}
