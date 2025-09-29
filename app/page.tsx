import HomeClient from './components/HomeClient'
import { getRecipes, getRecipeCategories } from './lib/data'

export default async function Home() {
  const recipes = await getRecipes();
  const categories = await getRecipeCategories();

  return <HomeClient initialRecipes={recipes} availableCategories={categories} />
}