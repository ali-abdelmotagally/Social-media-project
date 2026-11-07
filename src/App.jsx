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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PostDetails from './Components/Post Details/PostDetails';
import Offline from './Offline/Offline';
import {useNetworkState} from "react-use" // let users know when offline
import { ToastContainer } from 'react-toastify';



const query = new QueryClient();


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
      {path : 'loadingScreen', element : <LoadingScreen/>},
      {path : 'postDetails', element : <ProtectedRoute> <PostDetails/> </ProtectedRoute>},
    ]
  }
])



export default function App() {
  const {online} = useNetworkState();

  return (
    <>
    {!online && <Offline/>}
    <QueryClientProvider client={query}>
      <AuthProvider>
       <CounterProvider>
        {/* provide the entire app with data used in the counterProvider function */}
          <RouterProvider router={router}></RouterProvider> 
       </CounterProvider>
      </AuthProvider>
    </QueryClientProvider>
    <ToastContainer/> 
    </>
  )
}


