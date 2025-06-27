import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sweet Delights Bakery',
  description: 'Fresh baked goods and delicious treats',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-right" />
        <NavBar />
        <div className="pt-4">{children}</div>
      </body>
    </html>
  )
}

function NavBar() {
  if (typeof window === 'undefined') return null
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null
  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.dispatchEvent(new Event('logout'))
    window.location.replace('/')
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-primary-600 text-white py-2 px-4 flex justify-between items-center shadow z-50">
      <div className="flex items-center space-x-4">
        <a href="/" className="font-bold text-lg">Sweet Delights Bakery</a>
        {role && <a href="/dashboard" className="underline">Dashboard</a>}
      </div>
      <div>
        {role ? (
          <>
            <span className="mr-4">{username} ({role})</span>
            <button onClick={handleLogout} className="bg-white text-primary-600 px-4 py-2 rounded font-bold shadow hover:bg-gray-100 border border-primary-600 transition">Logout</button>
          </>
        ) : (
          <a href="/" className="bg-white text-primary-600 px-3 py-1 rounded hover:bg-gray-100">Login</a>
        )}
      </div>
    </nav>
  )
} 