import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl

      if (pathname.startsWith('/add-recipe')) {
        return token?.role === 'admin'
      }

      if (pathname.startsWith('/my-recipes') || pathname.startsWith('/favorites')) {
        return !!token
      }

      return true
    },
  },
})

export const config = {
  matcher: ['/add-recipe', '/my-recipes', '/favorites'],
}
