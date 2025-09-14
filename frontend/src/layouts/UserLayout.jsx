import React from 'react';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Outlet />
    </div>
  );
};

export default UserLayout;