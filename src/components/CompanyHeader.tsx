import React from 'react';
import { Bell, Settings, User, LogOut, Building } from 'lucide-react';
import CompanyLogo from './CompanyLogo';

const CompanyHeader = ({ 
  user = { name: "John Smith", role: "Project Manager" },
  companyName = "BuildTech Solutions"
}) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Company Logo and Name */}
          <div className="flex items-center space-x-4">
            <CompanyLogo className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{companyName}</h1>
              <p className="text-xs text-gray-500">Construction Management Platform</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Dashboard
            </a>
            <a href="/projects" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Projects
            </a>
            <a href="/equipment" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Equipment
            </a>
            <a href="/tasks" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Tasks
            </a>
            <a href="/safety" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Safety
            </a>
            <a href="/estimates" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Estimates
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <div className="relative">
                <button className="flex items-center p-2 text-gray-600 hover:text-gray-900 bg-gray-100 rounded-full">
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Settings */}
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a href="/" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Dashboard
          </a>
          <a href="/projects" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Projects
          </a>
          <a href="/equipment" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Equipment
          </a>
          <a href="/tasks" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Tasks
          </a>
          <a href="/safety" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Safety
          </a>
          <a href="/estimates" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Estimates
          </a>
        </div>
      </div>
    </header>
  );
};

export default CompanyHeader;