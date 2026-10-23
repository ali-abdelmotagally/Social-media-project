import React from 'react'

export default function LoadingScreen() {
  return (

    <div className="flex w-vw min-h-screen items-center justify-center ">
        <div className="w-10 h-10 rounded-full bg-gray-600 z-1 animate-bounce">
        </div>

        <div className="w-10 h-10 rounded-full bg-blue-400 z-2 -ml-3 animate-bounce">
        </div>

        <div className="w-10 h-10 rounded-full bg-gray-400 z-2 -ml-3 animate-bounce">
        </div>
    </div>
    
  )
}
