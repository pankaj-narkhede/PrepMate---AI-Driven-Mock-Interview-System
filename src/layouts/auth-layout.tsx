
import { Outlet } from 'react-router'

const AuthLayout = () => {
  return (
   <>
   <div className='w-screen h-screen overflow-hidden justify-center items-center flex relative'>
    <img src="src\assets\bakery.png" className='absolute w-full h-full object-cover opacity-15 'alt="" />
    <Outlet/>
   </div>
   </>
  )
}

export default AuthLayout;