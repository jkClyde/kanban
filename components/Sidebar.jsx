'use client'

import { useState, useEffect } from "react";
import {
  FiBarChart,
  FiHome,
  FiMonitor,
  FiUser,
  FiArrowLeft, 
  FiArrowRight,
  FiLogOut
} from "react-icons/fi";
import { FaTasks, FaGoogle } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
import profileDefault from '@/public/images/profile.png';

export const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Dashboard");
  const { data: session } = useSession();
  const [providers, setProviders] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileImage = session?.user?.image;

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
  
    setAuthProviders();
  
    // Close profile menu if the viewport size is changed
    window.addEventListener('resize', () => {
      setIsProfileMenuOpen(false);
    });

    return () => {
      window.removeEventListener('resize', () => {
        setIsProfileMenuOpen(false);
      });
    };
  }, []);
  
  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 bg-sidebar p-2 flex flex-col justify-between"
      style={{
        width: open ? "236px" : "fit-content",
      }}
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <ToggleClose open={open} setOpen={setOpen} />
        </div>

        <div className="space-y-1">
          <Link href={"/"}>
            <Option
                Icon={FiHome}
                title="Dashboard"
                selected={selected}
                setSelected={setSelected}
                open={open}
              />
          </Link>

          <Link href="/projects">
            <Option
              Icon={FiMonitor}
              title="Projects"
              selected={selected}
              setSelected={setSelected}
              open={open}
            />
          </Link>
         
         <Link href="/tasks">
          <Option
              Icon={FaTasks}
              title="Tasks"
              selected={selected}
              setSelected={setSelected}
              open={open}
            />
         </Link>
          <Option
            Icon={FiBarChart}
            title="Analytics"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
          <Option
            Icon={FiUser}
            title="Account"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
        </div>
      </div>

      {/* Login/Profile Component */}
      <div className="mt-auto">
        {!session ? (
          // Login component for logged out users
          <div className="pt-4 border-t border-gray-700">
            {providers &&
              Object.values(providers).map((provider) => (
                <motion.button
                  layout
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="flex items-center w-full px-2 py-3 text-white hover:bg-[#212121] rounded-md transition-colors"
                >
                  <div className="grid h-full w-10 place-content-center text-lg">
                    <FaGoogle className="text-white" />
                  </div>
                  {open && (
                    <motion.span
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.125 }}
                      className="text-sm font-medium text-white"
                    >
                      Login or Register
                    </motion.span>
                  )}
                </motion.button>
              ))}
          </div>
        ) : (
          // Profile component for logged in users
          <div className="pt-4 border-t border-gray-700">
            <div className="relative">
              <motion.button
                layout
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center w-full px-2 py-2 text-white hover:bg-[#212121] rounded-md transition-colors"
              >
                <div className="grid h-full w-10 place-content-center">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-800">
                    <Image
                      src={profileImage || profileDefault}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                {open && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.125 }}
                    className="ml-2 text-left overflow-hidden"
                  >
                    <p className="text-sm font-medium text-white truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {session.user.email}
                    </p>
                  </motion.div>
                )}
              </motion.button>

              {/* Profile dropdown - now positioned above the profile button */}
              {isProfileMenuOpen && open && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 right-0 bottom-full mb-1 bg-[#212121] rounded-md shadow-lg overflow-hidden z-10"
                >
                  <Link href="/profile"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#2a2a2a]"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link href="/properties/saved"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#2a2a2a]"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Saved Properties
                  </Link>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2a2a2a]"
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}
              
              {/* Sign out button (visible when sidebar is collapsed) */}
              {!open && (
                <motion.button
                  layout
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center justify-center w-full mt-2 p-2 text-white hover:bg-[#212121] rounded-md transition-colors"
                >
                  <FiLogOut className="text-white" />
                </motion.button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

const Option = ({ Icon, title, selected, setSelected, open, notifs , link}) => {
  return (
    <motion.button
      layout
      onClick={() => setSelected(title)}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${selected === title ? "bg-[#212121] text-indigo-800" : "text-slate-500 hover:bg-[#212121]"} cursor-pointer`}
    >
      <motion.div
        layout
        className="grid h-full w-10 place-content-center text-lg"
      >
        <Icon className="text-white"/>
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-sm font-medium text-white"
        >
          {title}
        </motion.span>
      )}

      {notifs && open && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          style={{ y: "-50%" }}
          transition={{ delay: 0.5 }}
          className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white"
        >
          {notifs}
        </motion.span>
      )}
    </motion.button>
  );
};

const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="transition-colors cursor-pointer"
    >
      <div className="flex items-center p-2 justify-end">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          {open ? (
            <FiArrowLeft className="transition-all duration-200 text-white" />
          ) : (
            <FiArrowRight className="transition-all duration-200 text-white" />
          )}
        </motion.div>
      </div>
    </motion.button>
  );
};