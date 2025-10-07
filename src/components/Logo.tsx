import React from 'react';

const Logo = ({ className = "w-12 h-12" }: { className?: string }) => {
  return (
    <img
      src="/logo.jpeg"
      alt="Wasilah Logo"
      className={`${className} object-contain rounded-lg`}
    />
  );
};

export default Logo;