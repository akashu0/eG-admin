"use client";

import React, { JSX, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  TrendingUp,
  ChevronDown,
  Handshake,
} from "lucide-react";

interface SubMenuItem {
  name: string;
  path: string;
  permission?: boolean;
}

interface MenuItem {
  name: string;
  path?: string;
  icon: any;
  permission?: boolean;
  subMenus?: SubMenuItem[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}



const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);


  const isActive = (path: string): boolean => pathname === path;

  const toggleSubMenu = (itemName: string): void => {
    setOpenSubMenus((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };




  const menuGroups: MenuGroup[] = [
    {
      title: "website",
      items: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: LayoutDashboard,
          permission: true,
        },
        {
          name: "Courses",
          icon: TrendingUp,
          path: "/dashboard/courses",
          permission: true,
          // subMenus: [
          //   {
          //     name: "Course List",
          //     path: "/dashboard/courses",
          //     permission: true,
          //   },
          //   {
          //     name: "Add Course",
          //     path: "/dashboard/courses/add-courses",
          //     permission: true,
          //   },
          // ],
        },
        {
          name: "Universities",
          icon: Building2,
          permission: true,
          path: "/dashboard/universities",
          // subMenus: [
          //   {
          //     name: "University List",
          //     path: "/dashboard/universities",
          //     permission: true,
          //   },
          //   {
          //     name: "Add University",
          //     path: "/dashboard/universities/add-universities",
          //     permission: true,
          //   },
          // ],
        },
        {
          name: "Countries",
          icon: Briefcase,
          permission: true,
          path: "/dashboard/countries",
          // subMenus: [
          //   {
          //     name: "Country List",
          //     path: "/dashboard/countries",
          //     permission: true,
          //   },
          //   {
          //     name: "Add Country",
          //     path: "/dashboard/countries/add-countries",
          //     permission: true,
          //   },
          // ],
        },
        {
          name: "eG Learning Center",
          path: "/dashboard/eg-earning-center",
          icon: Handshake,
          permission: true,
        },
        {
          name: "Visa",
          path: "/dashboard/visa",
          icon: Building2,
          permission: true,


        },
        {
          name: "eG Blogs",
          path: "/blogs",
          icon: Briefcase,
          permission: true,

          // subMenus: [
          //   {
          //     name: "Blog List",
          //     path: "/blogs",
          //     permission: true,
          //   },
          //   {
          //     name: "Add Blog",
          //     path: "/blogs/add-blog",
          //     permission: true,
          //   }
          // ],

        },
      ],
    },

  ];

  const renderMenuItem = (item: MenuItem): JSX.Element | null => {
    if (!item.permission) return null;

    const IconComponent = item.icon;
    const hasSubMenus = item.subMenus && item.subMenus.length > 0;
    const isSubMenuOpen = openSubMenus.includes(item.name);

    if (hasSubMenus) {
      return (
        <div key={item.name} className="mb-1">
          <button
            onClick={() => toggleSubMenu(item.name)}
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`
              w-full flex items-center justify-between px-4 py-2.5 rounded-lg
              text-sm font-medium transition-all duration-300 ease-in-out
              transform
              ${hoveredItem === item.name
                ? "bg-purple-50 text-purple-700 translate-x-1"
                : "text-gray-700 hover:bg-gray-50"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <IconComponent
                className={`w-5 h-5 transition-transform duration-300 ${hoveredItem === item.name ? "scale-110" : ""
                  }`}
              />
              <span>{item.name}</span>
            </div>
            <div
              className={`transition-transform duration-300 ${isSubMenuOpen ? "rotate-180" : ""
                }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>

          <div
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${isSubMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
            `}
          >
            <div className="ml-4 mt-1 space-y-1">
              {item.subMenus?.map((subItem, index) => {
                if (!subItem.permission) return null;

                return (
                  <button
                    key={subItem.path}
                    onClick={() => router.push(subItem.path)}
                    onMouseEnter={() => setHoveredItem(subItem.path)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2 rounded-lg
                      text-sm font-medium transition-all duration-300 ease-in-out
                      transform
                      ${isActive(subItem.path)
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md"
                        : hoveredItem === subItem.path
                          ? "bg-purple-50 text-purple-700 translate-x-1"
                          : "text-gray-600 hover:bg-gray-50"
                      }
                    `}
                    style={{
                      transitionDelay: isSubMenuOpen ? `${index * 50}ms` : "0ms",
                    }}
                  >
                    <div
                      className={`
                      w-1.5 h-1.5 rounded-full bg-current transition-transform duration-300
                      ${hoveredItem === subItem.path ? "scale-150" : ""}
                    `}
                    />
                    <span>{subItem.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return (
      <button
        key={item.path}
        onClick={() => item.path && router.push(item.path)}
        onMouseEnter={() => setHoveredItem(item.path || "")}
        onMouseLeave={() => setHoveredItem(null)}
        className={`
          w-full flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 cursor-pointer
          text-sm font-medium transition-all duration-300 ease-in-out
          transform
          ${isActive(item.path || "")
            ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md"
            : hoveredItem === item.path
              ? "bg-purple-50 text-purple-700 translate-x-1"
              : "text-gray-700 hover:bg-gray-50"
          }
        `}
      >
        <IconComponent
          className={`w-5 h-5 transition-transform duration-300 ${hoveredItem === item.path ? "scale-110" : ""
            }`}
        />
        <span>{item.name}</span>
      </button>
    );
  };

  const shouldShowGroup = (group: MenuGroup): boolean => {
    return group.items.some((item) => item.permission);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-purple-700 transition-transform duration-300 hover:scale-105">
          eduGuardian
        </h1>
      </div>

      <div className="flex-1 p-4 space-y-6">
        {menuGroups.map(
          (group, index) =>
            shouldShowGroup(group) && (
              <div
                key={index}
                className="animate-fadeIn"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <h3 className="px-4 mb-2 text-xs font-bold text-purple-800 uppercase tracking-wider transition-colors duration-300 hover:text-purple-600">
                  {group.title}
                </h3>
                <div className="space-y-1">{group.items.map(renderMenuItem)}</div>
              </div>
            )
        )}
      </div>



      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;