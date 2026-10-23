import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import NotFound from './Components/NOT-FOUND/NotFound';
import Home from './Components/Home/Home';
import Layout from './Components/Layout/Layout';
import { CounterProvider } from './Components/Context/CounterContext';
import { AuthProvider } from './Components/Context/AuthCotext';
import Profile from './Components/Profile/Profile';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import LoadingScreen from './Components/LoadingScreen/LoadingScreen';


const router = createBrowserRouter([
  {
    path : '/', element: <Layout/>,
    children : [
      {index : true, element : <ProtectedRoute> <Home/> </ProtectedRoute>},
      {path : 'home', element : <ProtectedRoute> <Home/> </ProtectedRoute>},
      {path : 'register', element : <Register/>} ,
      {path : 'profile', element : <ProtectedRoute> <Profile/> </ProtectedRoute>},
      {path : 'login', element : <Login/>},
      {path : '*', element : <NotFound/>},
      {path : 'resetPassword', element : <ResetPassword/>},
      {path : 'loadingScreen', element : <LoadingScreen/>}
    ]
  }
])



function App() {

  return (
    <AuthProvider>
      <CounterProvider>
        {/* provide the entire app with data used in the counterProvider function */}
        <RouterProvider router={router}></RouterProvider> 
     </CounterProvider>
    </AuthProvider>
  )
}

export default App
