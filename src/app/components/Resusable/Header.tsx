"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  X,
} from "lucide-react";

// Helper: Convert pathname to breadcrumb
const generateBreadcrumb = (pathname: string) => {
  const paths = pathname.split("/").filter((p) => p && p !== "admin");
  const titles: Record<string, string> = {
    dashboard: "Dashboard",
    leads: "Leads",
    agents: "Agents",
    companies: "Companies",
    reports: "Reports",
    settings: "Settings",
    profile: "Profile",
  };

  return paths.map((segment, i) => ({
    name: titles[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
    path: `/admin/${paths.slice(0, i + 1).join("/")}`,
    isLast: i === paths.length - 1,
  }));
};

const Header = () => {
  const pathname = usePathname();
  const breadcrumb = generateBreadcrumb(pathname);

  // Current page title (last breadcrumb)
  const currentPageTitle = breadcrumb[breadcrumb.length - 1]?.name || "Dashboard";

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { title: "New Lead Added", message: "John Doe joined eG Students", time: "5 min ago", unread: true },
    { title: "Report Ready", message: "Daily report generated", time: "1 hour ago", unread: true },
    { title: "Meeting Soon", message: "Team sync in 30 mins", time: "2 hours ago", unread: false },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">

          {/* LEFT: Page Title + Breadcrumb */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentPageTitle}
            </h1>
            <nav className="flex mt-1 text-sm text-gray-500" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-1">
             
                {breadcrumb.map((item, i) => (
                  <li key={i} className="flex items-center">
                    <span className=" text-gray-400">/</span>
                    <span className={item.isLast ? "text-purple-600 font-medium " : "text-gray-500"}>
                      {item.name}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* RIGHT: Notifications + Profile */}
          <div className="flex items-center gap-4">

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  3
                </span>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)}>
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((n, i) => (
                      <div key={i} className="p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{n.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{n.time}</p>
                          </div>
                          {n.unread && <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 ml-3" />}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t">
                    <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative ">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* Profile Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-4 w-56 bg-white  rounded-xl shadow-xl border border-gray-200 z-50">
               
                  <div className="py-4 p-2 ">
                    <a href="/admin/profile" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4" /> My Profile
                    </a>
                    <a href="/admin/settings" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50">
                      <Settings className="w-4 h-4" /> Settings
                    </a>
                  </div>
                  <div className="border-t border-gray-200 py-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 text-left">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;