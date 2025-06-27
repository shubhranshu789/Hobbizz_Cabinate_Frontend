import { ContinuousCalendar } from "@/components/ContinuousCalendar";
import DemoWrapper from "@/components/DemoWrapper";
import Navbar from "../../EditorNavbar/page"
import Footer from "../../../Footer/page"


export default function Home() {
  return (

    <div>
      <main className="flex min-h-screen items-center justify-center">
        <div style={{display : "flex" , flexDirection : "column"}}>
          <Navbar/>
          <DemoWrapper />
          
        </div>
        
      </main>
    <Footer/>
    </div>
  );
}
