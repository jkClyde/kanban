import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { Sidebar } from "@/components/Sidebar";



export const metadata = {
  title: "Kanban Project Manager",
  keywords: "Rental Property, Real Estate",
  description: "Find The Perfect Rental Propery",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
    <html lang="en">
      <body className={`antialiased`} >
        <main className="flex flex-row ">
          <Sidebar/>
          <div className="w-full flex justify-center items-center">
          {children}
          </div>
        </main>
      </body>
    </html>
    </AuthProvider>
  );
}
