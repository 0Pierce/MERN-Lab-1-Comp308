import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Homepage from "/src/pages/Homepage.jsx"
import LoginPage from "/src/pages/LoginPage.jsx"
import AdminPage from "/src/pages/AdminPage.jsx"
import RegisterPage from "/src/pages/RegisterPage.jsx"




const mainRouter = createBrowserRouter([

  
  {
    path: "/",
    element: <Homepage/>
  },

  {
    path: "Login",
    element: <LoginPage/>
  },

  {
    path: "Register",
    element: <RegisterPage/>
  },

  {
    path: "Admin",
    element: <AdminPage/>
  }

])




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={mainRouter}/>
  </StrictMode>,
)
