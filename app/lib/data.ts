export interface Recipe {
    id: string
    slug: string
    title: string
    content: string
    description: string
    imageUrl: string
    category: string
    prepTime?: number         // in minutes
    cookTime?: number         // in minutes
    createdAt: string
    authorId: string
    ratings?: RecipeRating[]
}

export interface User {
    id: string
    email: string
    name: string
    password: string
    role: 'admin' | 'user'
    createdAt: string
}

export const recipes: Recipe[] = [
    {
        id: '1',
        slug: 'banitsa',
        title: 'Banitsa',
        description: 'Cheese, eggs, and filo pastry – a classic Bulgarian breakfast.',
        content: 'Mix filo pastry, eggs, cheese, and yogurt. Bake at 180°C for 40 minutes.',
        imageUrl: '/banitsa.jpg',
        category: 'Breakfast',
        prepTime: 15,
        cookTime: 40,
        createdAt: '2024-01-01T00:00:00.000Z',
        authorId: '1'
    },
    {
        id: '2',
        slug: 'shopska-salad',
        title: 'Shopska Salad',
        description: 'Fresh salad with tomato, cucumber, and cheese.',
        content: 'Combine tomato, cucumber, pepper, onion, parsley, and grated cheese. Season with olive oil and vinegar.',
        imageUrl: '/shopska-salad.jpg',
        category: 'Salad',
        prepTime: 10,
        cookTime: 5,
        createdAt: '2024-01-01T00:00:00.000Z',
        authorId: '2'
    },
    {
        id: '3',
        slug: 'chicken-soup',
        title: 'Chicken Soup',
        description: 'Comforting homemade chicken soup with vegetables.',
        content: 'Boil chicken with carrots, celery, onion, and seasoning. Simmer for 45 minutes. Serve hot with fresh herbs.',
        imageUrl: '/chicken-soup.jpg',
        category: 'Soup',
        prepTime: 15,
        cookTime: 45,
        createdAt: '2024-01-02T00:00:00.000Z',
        authorId: '1'
    },
    {
        id: '4',
        slug: 'chocolate-cake',
        title: 'Chocolate Cake',
        description: 'Rich and moist chocolate cake with a silky frosting.',
        content: 'Mix flour, cocoa, sugar, eggs, butter, and baking powder. Bake at 180°C for 30 minutes. Frost with chocolate ganache.',
        imageUrl: '/chocolate-cake.jpg',
        category: 'Dessert',
        prepTime: 20,
        cookTime: 30,
        createdAt: '2024-01-03T00:00:00.000Z',
        authorId: '2'
    },
    {
        id: '5',
        slug: 'vegan-stir-fry',
        title: 'Vegan Stir-Fry',
        description: 'Colorful vegetables stir-fried in a savory sauce.',
        content: 'Sauté broccoli, bell peppers, carrots, and tofu in soy sauce and garlic. Serve over rice or noodles.',
        imageUrl: '/vegan-stir-fry.jpg',
        category: 'Vegan',
        prepTime: 10,
        cookTime: 15,
        createdAt: '2024-01-04T00:00:00.000Z',
        authorId: '1'
    },
    {
        id: '6',
        slug: 'tomato-soup',
        title: 'Tomato Soup',
        description: 'Smooth and creamy tomato soup perfect for any meal.',
        content: 'Cook tomatoes, onion, and garlic until soft. Blend and simmer with vegetable broth. Serve with a drizzle of cream.',
        imageUrl: '/tomato-soup.jpg',
        category: 'Soup',
        prepTime: 10,
        cookTime: 25,
        createdAt: '2024-01-05T00:00:00.000Z',
        authorId: '2'
    },
    {
        id: '7',
        slug: 'fruit-salad',
        title: 'Fruit Salad',
        description: 'Refreshing mix of seasonal fruits with a honey-lime dressing.',
        content: 'Chop apples, oranges, berries, and kiwi. Mix with honey, lime juice, and fresh mint.',
        imageUrl: '/fruit-salad.jpg',
        category: 'Dessert',
        prepTime: 10,
        cookTime: 5,
        createdAt: '2024-01-06T00:00:00.000Z',
        authorId: '1'
    },
    {
        id: '8',
        slug: 'grilled-salmon',
        title: 'Grilled Salmon',
        description: 'Juicy grilled salmon fillets with lemon herb sauce.',
        content: 'Season salmon fillets with salt, pepper, and olive oil. Grill for 4-5 minutes per side. Mix lemon juice, garlic, parsley, and olive oil for the sauce. Serve salmon topped with sauce and a side of roasted vegetables.',
        imageUrl: '/grilled-salmon.jpg',
        category: 'Main Course',
        prepTime: 15,
        cookTime: 15,
        createdAt: '2024-01-07T00:00:00.000Z',
        authorId: '1'
    }
]

export function getRecipes() {
    return recipes
}

export function addRecipe(data: Omit<Recipe, 'id'>) {
    const newRecipe = { ...data, id: (recipes.length + 1).toString() }
    recipes.push(newRecipe)
    return newRecipe
}

// export async function getRecipes(): Promise<Recipe[]> {
//     return recipes;
// }

export async function getRecipeCategories(): Promise<string[]> {
    const categories = Array.from(new Set(recipes.map(r => r.category)));
    return categories;
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
    return recipes.find(r => r.slug === slug)
}

// export function addRecipe(recipe: Omit<Recipe, 'id' | 'createdAt'>): Recipe {
//   const newRecipe = {
//     ...recipe,
//     id: (recipes.length + 1).toString(),
//     createdAt: new Date().toISOString()
//   }
//   recipes.push(newRecipe)
//   return newRecipe
// }

export function getRecipeById(id: string) {
    return recipes.find(r => r.id === id)
}

export function updateRecipe(id: string, data: Partial<Omit<Recipe, 'id' | 'createdAt' | 'authorId'>>) {
    const index = recipes.findIndex(r => r.id === id)
    if (index === -1) return null
    recipes[index] = { ...recipes[index], ...data }
    return recipes[index]
}

export function deleteRecipe(id: string) {
    const index = recipes.findIndex(r => r.id === id)
    if (index === -1) return false
    recipes.splice(index, 1)
    return true
}

const favoriteRecipesMap: Record<string, string[]> = {}

export function addToFavorites(userId: string, recipeId: string): boolean {
    const userFavorites = favoriteRecipesMap[userId] || []
    if (userFavorites.includes(recipeId)) return false
    const recipeExists = recipes.some(r => r.id === recipeId)
    if (!recipeExists) return false
    favoriteRecipesMap[userId] = [...userFavorites, recipeId]
    return true
}

export function removeFromFavorites(userId: string, recipeId: string): boolean {
    const userFavorites = favoriteRecipesMap[userId] || []
    if (!userFavorites.includes(recipeId)) return false
    favoriteRecipesMap[userId] = userFavorites.filter(id => id !== recipeId)
    return true
}

export function getFavoriteRecipes(userId: string): Recipe[] {
    const userFavorites = favoriteRecipesMap[userId] || []
    return recipes.filter(r => userFavorites.includes(r.id))
}

type RecipeRating = {
    userId: string
    rating: number
    review?: string
}

export function getUserRecipeRating(recipeId: string, userId: string) {
    const recipe = recipes.find(r => r.id === recipeId)
    if (!recipe) return null
    return recipe.ratings?.find(r => r.userId === userId) || null
}

export function addRecipeRating(recipeId: string, userId: string, rating: number, review?: string) {
    const recipe = recipes.find(r => r.id === recipeId)
    if (!recipe) return null
    if (!recipe.ratings) recipe.ratings = []

    // Prevent duplicate rating from same user
    const existing = recipe.ratings.find(r => r.userId === userId)
    if (existing) {
        existing.rating = rating
        existing.review = review
    } else {
        recipe.ratings.push({ userId, rating, review })
    }

    return recipe
}

export const users: User[] = [
    {
        id: '1',
        email: 'admin@recipebook.com',
        name: 'Recipe Admin',
        password: '$2b$10$Vp41WiGzXbNY2cAl7rqC/u46K126o1uOhEfUjWR83.uzlL8ExBvIq', // 'password'
        role: 'admin',
        createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
        id: '2',
        email: 'demo@example.com',
        name: 'Demo User',
        password: '$2b$10$Vp41WiGzXbNY2cAl7rqC/u46K126o1uOhEfUjWR83.uzlL8ExBvIq', // 'password'
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z'
    }
]

export function getUserByEmail(email: string): User | undefined {
    return users.find(u => u.email === email)
}

export function addUser(userData: Omit<User, 'id' | 'role' | 'createdAt'>): User {
    const newUser: User = {
        ...userData,
        id: (users.length + 1).toString(),
        role: 'user',
        createdAt: new Date().toISOString()
    }

    users.push(newUser)
    return newUser
}
