"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      toast.error('Please fill all fields')
      return
    }
    if (username.toLowerCase() === 'admin') {
      toast.error('Cannot register as admin')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await axios.post('http://localhost:3001/api/register', { username, password })
      toast.success('Registration successful! You can now login.')
      setTimeout(() => router.push('/login'), 1500)
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create User Account</h2>
        <form onSubmit={handleRegister} className="space-y-4">
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="input-field"
            required
          />
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        </form>
        <div className="mt-4 text-center">
          <a href="/login" className="text-primary-600 hover:underline">Back to Login</a>
        </div>
      </div>
    </div>
  )
} 