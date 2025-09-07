import React from 'react';

// Fix: Extend CardProps with standard HTML div attributes to allow passing props like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};
