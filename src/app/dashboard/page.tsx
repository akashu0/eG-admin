// "use client";

import React from "react";
import {
  GraduationCap,
  Building2,
  Globe2,
  FileEdit,
  Plus,
  ArrowRight,
  TrendingUp,
  Users
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { useCourseDraftStore } from "@/store/courseDraftStore";
import { useUniversityDraftStore } from "@/store/universityDraftStore";

export default function DashboardPage() {
  // const { drafts: courseDrafts } = useCourseDraftStore();
  // const { drafts: universityDrafts } = useUniversityDraftStore();

  // This would ideally come from an API
  const stats = [
    {
      title: "Active Courses",
      value: "1,234",
      change: "+12%",
      icon: GraduationCap,
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    {
      title: "Partner Universities",
      value: "56",
      change: "+4",
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Countries",
      value: "12",
      change: "0",
      icon: Globe2,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      title: "Total Students",
      value: "8,543",
      change: "+25%",
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-100"
    }
  ];

  // const recentDrafts = [
  //   ...courseDrafts.map(d => ({ ...d, type: 'Course', name: d.overview.courseName, path: '/dashboard/courses/add-courses' })),
  //   ...universityDrafts.map(d => ({ ...d, type: 'University', name: d.overview.name, path: '/dashboard/universities/add-universities' }))
  // ].sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
  //   .slice(0, 5);

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back. Here's what's happening with your content.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/courses/add-courses">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              New Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 border-none shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-xs">
              <span className={`font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-gray-600'}`}>
                {stat.change}
              </span>
              <span className="text-gray-400 ml-1">from last month</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Drafts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Drafts</h2>
            <Link href="/dashboard/courses/drafts" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              View All
            </Link>
          </div>


        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          <Card className="p-6 border-none shadow-sm bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
            <h3 className="font-semibold text-lg mb-2">Create New Content</h3>
            <p className="text-purple-100 text-sm mb-6">Start adding new universities or courses to your catalog.</p>
            <div className="space-y-3">
              <Link href="/dashboard/universities/add-universities" className="block">
                <Button variant="secondary" className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-0">
                  <Building2 className="h-4 w-4 mr-2" /> Add University
                </Button>
              </Link>
              <Link href="/dashboard/countries/add-countries" className="block">
                <Button variant="secondary" className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-0">
                  <Globe2 className="h-4 w-4 mr-2" /> Add Country
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-5 border-gray-100 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Database</span>
                <span className="flex items-center text-green-600 font-medium"><div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div> Connected</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">API Gateway</span>
                <span className="flex items-center text-green-600 font-medium"><div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div> Online</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Storage</span>
                <span className="flex items-center text-green-600 font-medium"><div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div> Healthy</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
