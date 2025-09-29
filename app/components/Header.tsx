'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-xl border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Left side: Logo and navigation */}
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 transition-all duration-200"
            >
              🍳 Recipe Book
            </Link>

            <nav className="hidden md:flex space-x-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-green-500 hover:to-yellow-500 transition-all duration-200 font-medium"
              >
                Home
              </Link>

              {session && (
                <>
                  <Link
                    href="/my-recipes"
                    className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-green-500 hover:to-yellow-500 transition-all duration-200 font-medium"
                  >
                    My Recipes
                  </Link>

                  {session.user?.role === 'admin' && (
                    <Link
                      href="/add-recipe"
                      className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-green-500 hover:to-yellow-500 transition-all duration-200 font-medium"
                    >
                      Add Recipe
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>

          {/* Right side: Auth controls */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="flex items-center space-x-2 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {(session.user?.name || session.user?.email)?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">
                    Hello, {session.user?.name || session.user?.email}
                  </span>
                </div>

                <button
                  onClick={() => signOut()}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/signup"
                  className="text-green-600 hover:text-green-800 font-medium transition-colors"
                >
                  Sign Up
                </Link>
                <button
                  onClick={() => signIn()}
                  className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white px-4 py-2 rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}