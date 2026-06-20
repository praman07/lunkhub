import { useState } from 'react'
import './App.css'
import router from './app.routes'
import { RouterProvider } from 'react-router'

function App() {
  
  return (
    <RouterProvider router={router} />
  )
}

export default App
