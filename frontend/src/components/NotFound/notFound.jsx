import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <>
        {/* <section className='flex flex-col '>
          <div className="justify-items-center items-center">
            <img src="\notfound.png" alt="notfound" />
            <Link className='bg-green-400 m-8 p-2 text-white hover:bg-black'  to={'/'}>RETURN TO HOME PAGE</Link>
          </div>
        </section> */}
         <section className='page notfound'>
          <div className="content">
            <img src="/notfound.png" alt="notfound" />
            <Link to={'/'}>RETURN TO HOME PAGE</Link>
          </div>
        </section>
    </>
  )
}

export default NotFound