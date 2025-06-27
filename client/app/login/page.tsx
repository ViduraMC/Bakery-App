"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:3001/api/login', { username, password })
      console.log('Login response:', res.data)
      localStorage.setItem('role', res.data.role)
      localStorage.setItem('username', res.data.username)
      console.log('Stored role:', res.data.role)
      toast.success('Login successful!')
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Login error:', err)
      toast.error(err?.response?.data?.error || 'Invalid username or password')
    } finally {
      setLoading(false)
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
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <div className="mt-4 text-center">
          <span>Don&apos;t have an account? </span>
          <a href="/register" className="text-primary-600 hover:underline">Register</a>
        </div>
      </div>
    </div>
  )
} 