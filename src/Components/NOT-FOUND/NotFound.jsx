import React from 'react'
import { Helmet } from 'react-helmet'


export default function NotFound() {
  return (
    <>
    <Helmet>
        <title>LinkUp | Error</title>
    </Helmet>

    <div className="w-full min-h-screen flex items-center justify-center">
      <h1 className="text-2xl md:text-5xl">Uh oh! This page is not found :(</h1>
    </div>
    </>
  )
}
