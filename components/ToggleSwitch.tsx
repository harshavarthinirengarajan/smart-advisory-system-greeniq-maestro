
import React from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, label }) => {
  const switchId = React.useId();
  return (
    <label htmlFor={switchId} className="flex items-center justify-between cursor-pointer">
       <span className="text-gray-700 font-medium">{label}</span>
      <div className="relative">
        <input 
          id={switchId} 
          type="checkbox" 
          className="sr-only" 
          checked={enabled} 
          onChange={(e) => onChange(e.target.checked)} 
        />
        <div className={`block w-14 h-8 rounded-full transition-colors ${enabled ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
      </div>
    </label>
  );
};
