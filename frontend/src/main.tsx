import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import Navbar from './components/Navbar'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    // @ts-ignore
    element: <Login />,
  },
  {
    path: '/register',
    // @ts-ignore
    element: <Register />,
  },
  {
    path: '/dashboard',
    // @ts-ignore
    element: <Dashboard />,
  },

])


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Navbar />
    <Toaster position='bottom-center' />
    <RouterProvider router={router} />
  </React.StrictMode>,
)
