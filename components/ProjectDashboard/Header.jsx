import React from 'react';

export const Header = () => {
  return (
    <header className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold">Project Management Dashboard</h1>
        <p className="mt-1 text-indigo-100">Track and manage your projects efficiently</p>
      </div>
    </header>
  );
};