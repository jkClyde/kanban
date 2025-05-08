import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { Sidebar } from "@/components/Sidebar";
import { ToastProvider } from "@/components/ToastProvider";
import MobileMenu from "@/components/MobileMenu";



export const metadata = {
  title: "Cly Project Manager",
  keywords: "Project Management, Management, Tasks, Projects",
  description: "Track and manage your projects efficiently",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
    <html lang="en">
      <body className={`antialiased`} >
          <main className="flex flex-col md:flex-row ">
          <ToastProvider>
            <Sidebar/>
            <MobileMenu/>
            <div className="w-full flex justify-center items-center bg-sidebar  px-2 md:px-2 py-2 ">
            {children}
            </div>
            </ToastProvider>

          </main>
      </body>
    </html>
    </AuthProvider>
  );
}
