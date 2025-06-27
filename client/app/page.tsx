"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Sample credentials
    if ((username === 'user' && password === '12345') || (username === 'admin' && password === '12345')) {
      // Save role in localStorage
      localStorage.setItem('role', username === 'admin' ? 'admin' : 'user')
      localStorage.setItem('username', username)
      toast.success('Login successful!')
      router.push('/dashboard')
    } else {
      toast.error('Invalid username or password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Bakery App Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input-field"
            required
          />
          <button type="submit" className="btn-primary w-full">Login</button>
        </form>
        <div className="mt-4 text-center">
          <span>Don&apos;t have an account? </span>
          <a href="/register" className="text-primary-600 hover:underline">Register</a>
        </div>
      </div>
    </div>
  )
} 