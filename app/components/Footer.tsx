import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Recipe Book</h3>
            <p className="text-gray-300">
              Discover, create, and share your favorite recipes all in one place.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-green-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/add-recipe" className="text-gray-300 hover:text-green-400 transition-colors">
                  Add Recipe
                </Link>
              </li>
              <li>
                <Link href="/my-recipes" className="text-gray-300 hover:text-green-400 transition-colors">
                  My Recipes
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">About</h4>
            <p className="text-gray-300">
              Built with Next.js 15, demonstrating modern web development best practices.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} Recipe Book. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
