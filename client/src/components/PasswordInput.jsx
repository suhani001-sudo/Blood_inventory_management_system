import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ 
  name, 
  placeholder, 
  value, 
  onChange, 
  required, 
  minLength,
  className = "",
  label 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-medium text-gray-600">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          name={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
          className={`w-full rounded-2xl border border-[#FFE8EC] bg-white px-3 py-2 pr-10 text-sm text-gray-900 shadow-sm outline-none transition-all focus:border-[#E21B2F] focus:bg-white focus:ring-2 focus:ring-[#E21B2F]/20 ${className}`}
        />
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#E21B2F] transition-colors"
          tabIndex="-1"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
