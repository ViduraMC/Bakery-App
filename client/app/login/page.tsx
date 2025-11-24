"use client";

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login, loading } = useAuth()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await login({ username, password })
        } catch (error) {
            // Error handling is done in the hook
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

                <div className="mt-6 p-4 bg-gray-100 rounded-md text-sm text-gray-600 border border-gray-200">
                    <p className="font-semibold mb-2 text-gray-800">Demo Credentials:</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium text-primary-700">User Access:</p>
                            <p>Username: <span className="font-mono bg-white px-1 rounded">user</span></p>
                            <p>Password: <span className="font-mono bg-white px-1 rounded">12345</span></p>
                        </div>
                        <div>
                            <p className="font-medium text-primary-700">Admin Access:</p>
                            <p>Username: <span className="font-mono bg-white px-1 rounded">admin</span></p>
                            <p>Password: <span className="font-mono bg-white px-1 rounded">12345</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}