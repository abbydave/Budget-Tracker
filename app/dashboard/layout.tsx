import NavBar from "@/components/dashboard_components/NavBar";
import SideBar from "@/components/dashboard_components/SideBar";



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden text-[#FFFFFF]">
      
      <div className=" bg-[#1E1F23] text-[#9CA3AF] h-15  border-b-[#6366F1]">
        <NavBar />
      </div>

      <div className="flex flex-col md:flex-row w-full grow h-0">
        
        <div className=" flex-none md:block md:w-66 bg-[#111827]">
          <SideBar />
        </div>
  
        <div className="bg-[#111827] flex-1 md:overflow-y-auto px-4 md:px-7.5 py-4 h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}