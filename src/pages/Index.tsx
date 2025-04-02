
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-gray-800">TestTracker</div>
          <div className="space-x-2">
            {user ? (
              <Link to="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>
        </header>

        <main className="flex flex-col items-center justify-center mt-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Manage Your QA Testing Process
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mb-8">
            A simple, intuitive platform for creating and managing test cases and tracking results.
            Perfect for developers and QA teams.
          </p>
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" className="text-lg py-6 px-8">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/register">
              <Button size="lg" className="text-lg py-6 px-8">
                Get Started
              </Button>
            </Link>
          )}
        </main>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">User Management</h2>
            <p className="text-gray-600">
              Create accounts for your team members and manage access to projects.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Project Organization</h2>
            <p className="text-gray-600">
              Create and organize multiple testing projects for different applications or features.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Test Case Management</h2>
            <p className="text-gray-600">
              Create detailed test cases with steps, expected results, and track their status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
