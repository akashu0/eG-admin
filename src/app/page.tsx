"use client";

import React, { useState } from "react";
import { 
  Building2, 
  GraduationCap, 
  Plane, 
  BookOpen, 
  Briefcase, 
  Home, 
  Bus,
  Globe,
  Users,
  Settings,
  ChevronRight,
  ExternalLink
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
  color: string;
}

const Page: React.FC = () => {
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const services: Service[] = [
    {
      id: "study-abroad",
      title: "eG Study Abroad",
      description: "Comprehensive study abroad consulting and university placement services",
      icon: <Globe className="w-8 h-8" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "visa",
      title: "Visa Process",
      description: "Expert visa assistance and documentation support for international students",
      icon: <Plane className="w-8 h-8" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      id: "academy",
      title: "eG Academy",
      description: "Quality education programs and skill development courses",
      icon: <BookOpen className="w-8 h-8" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      id: "jobs",
      title: "eG Jobs",
      description: "Career placement and job opportunities for students and professionals",
      icon: <Briefcase className="w-8 h-8" />,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: "accommodation",
      title: "eG Accommodation",
      description: "Safe and comfortable housing solutions for international students",
      icon: <Home className="w-8 h-8" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      id: "transportation",
      title: "eG Transportation",
      description: "Reliable transportation services for students and daily commutes",
      icon: <Bus className="w-8 h-8" />,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  const projects: Project[] = [
    {
      id: "crm",
      title: "CRM Application",
      description: "Customer Relationship Management system for managing leads, clients, and operations",
      link: "http://crm.myeduguardian.com",
      icon: <Users className="w-6 h-6" />,
      color: "text-violet-600"
    },
    {
      id: "website-admin",
      title: "Website Admin",
      description: "Content management and website administration portal",
      link: "/login",
      icon: <Settings className="w-6 h-6" />,
      color: "text-blue-600"
    }
  ];

  const handleProjectClick = (link: string) => {
    if (link.startsWith("http")) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = link;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-xl">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  edu<span className="text-purple-600">Guardian</span>
                </h1>
                <p className="text-sm text-gray-600 mt-1">Enterprise Management Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Building2 className="w-4 h-4" />
              <span>Educational Services Platform</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to eduGuardian Enterprise
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your comprehensive educational services platform. Access our CRM system, 
            manage website content, and explore our full range of services.
          </p>
        </div>

        {/* Project Access Section */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Settings className="w-6 h-6 text-purple-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">Project Access</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                  hoveredProject === project.id
                    ? "border-purple-400 transform scale-105"
                    : "border-transparent"
                }`}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => handleProjectClick(project.link)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${project.color} bg-opacity-10 p-3 rounded-lg`}>
                      {project.icon}
                    </div>
                    <div className="flex items-center space-x-1 text-purple-600">
                      <span className="text-sm font-medium">Access</span>
                      {project.link.startsWith("http") ? (
                        <ExternalLink className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {project.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500 font-mono">
                      {project.link}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section>
          <div className="flex items-center mb-6">
            <Globe className="w-6 h-6 text-purple-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">Our Services</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
                  hoveredService === service.id
                    ? "border-purple-300 transform translate-y-[-8px]"
                    : "border-transparent"
                }`}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div className="p-6">
                  <div className={`${service.bgColor} ${service.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4`}>
                    {service.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white rounded-xl shadow-md px-8 py-6 border border-purple-100">
            <p className="text-gray-600 mb-2">
              Need assistance? Contact our support team
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <a href="mailto:support@eduguardian.com" className="text-purple-600 hover:text-purple-700 font-medium">
                support@eduguardian.com
              </a>
              <span className="text-gray-300">|</span>
              <span className="text-gray-600">24/7 Support Available</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;