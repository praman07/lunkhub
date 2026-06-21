import { useState } from 'react'
import './App.css'
import router from './app.routes'
import { RouterProvider } from 'react-router'
import { AuthProvider } from '../features/auth/hooks/useAuth'

function App() {
  
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
