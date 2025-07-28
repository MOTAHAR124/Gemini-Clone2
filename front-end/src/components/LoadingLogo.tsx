import React from 'react';

interface LoadingLogoProps {
  size?: number;
  className?: string;
  onClick?: () => void;
}

const LoadingLogo: React.FC<LoadingLogoProps> = ({ size = 24, className = '', onClick }) => {
  return (
    <div 
      className={`relative ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {/* Dark gray outer circle */}
      <div 
        className="absolute inset-0 bg-gray-700 rounded-full"
        style={{ 
          width: size, 
          height: size
        }}
      />
              {/* Light blue inner square with rounded corners */}
        <div 
          className="inner-square absolute flex items-center justify-center bg-blue-400 rounded-md"
          style={{ 
            width: size * 0.4, 
            height: size * 0.4,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: size * 0.1
          }}
        />
    </div>
  );
};

export default LoadingLogo; 