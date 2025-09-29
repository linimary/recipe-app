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
    title: 'Баница',
    description: 'Сирене, яйца и кори – класическа българска закуска.',
    content: 'Смесете кори, яйца, сирене и кисело мляко. Изпечете на 180°C за 40 минути.',
    imageUrl: '/images/banitsa.jpg',
    category: 'Breakfast',
    prepTime: 15,
    cookTime: 40,
    createdAt: '2024-01-01T00:00:00.000Z',
    authorId: '1'
  },
  {
    id: '2',
    slug: 'shopska-salad',
    title: 'Шопска салата',
    description: 'Свежа салата с домат, краставица и сирене.',
    content: 'Домат, краставица, чушка, лук, магданоз, настъргано сирене. Подправете със зехтин и оцет.',
    imageUrl: '/images/shopska-salad.jpg',
    category: 'Salad',
    prepTime: 10,
    cookTime: 0,
    createdAt: '2024-01-01T00:00:00.000Z',
    authorId: '2'
  }
]

export async function getRecipes(): Promise<Recipe[]> {
    return recipes;
}

export async function getRecipeCategories(): Promise<string[]> {
    const categories = Array.from(new Set(recipes.map(r => r.category)));
    return categories;
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find(r => r.slug === slug)
}

export function addRecipe(recipe: Omit<Recipe, 'id' | 'createdAt'>): Recipe {
  const newRecipe = {
    ...recipe,
    id: (recipes.length + 1).toString(),
    createdAt: new Date().toISOString()
  }
  recipes.push(newRecipe)
  return newRecipe
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
