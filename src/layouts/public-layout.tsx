import Footer from "@/components/Footer"
import Header from "@/components/Header"
import AuthHandler from "@/handlers/authHandler"
import { Outlet } from "react-router"


const PublicLayout = () => {
  return (
    <div className="w-full">
      <AuthHandler/>
       <Header/>
       <Outlet/>
       <Footer/>
        </div>
  )
}

export default PublicLayout