import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import NotFound from './Components/NOT-FOUND/NotFound';
import Home from './Components/Home/Home';
import Layout from './Components/Layout/Layout';

const router = createBrowserRouter([
  {
    path : '/', element: <Layout/>,
    children : [
      {index : true, element : <Home/>},
      {path : 'home', element : <Home/>},
      {path : 'register', element : <Register/>},
      {path : 'login', element : <Login/>},
      {path : '*', element : <NotFound/>},
    ]
  }
])



function App() {

  return (
    <>
     <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
