import React from 'react';
import { AspectRatio } from '../types';
import { Square, Smartphone, Monitor, LayoutTemplate } from 'lucide-react';

interface AspectRatioSelectorProps {
  selected: AspectRatio;
  onSelect: (ratio: AspectRatio) => void;
  disabled?: boolean;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selected, onSelect, disabled }) => {
  const ratios: { value: AspectRatio; label: string; icon: React.ReactNode }[] = [
    { value: '1:1', label: 'Square', icon: <Square size={18} /> },
    { value: '3:4', label: 'Portrait', icon: <Smartphone size={18} className="rotate-0" /> },
    { value: '4:3', label: 'Landscape', icon: <LayoutTemplate size={18} /> },
    { value: '16:9', label: 'Wide', icon: <Monitor size={18} /> },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {ratios.map((ratio) => (
        <button
          key={ratio.value}
          onClick={() => onSelect(ratio.value)}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
            ${selected === ratio.value
              ? 'bg-primary-100 border-primary-500 text-primary-800 shadow-sm'
              : 'bg-white border-slate-200 text-slate-600 hover:border-primary-300 hover:bg-slate-50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {ratio.icon}
          <span>{ratio.label}</span>
        </button>
      ))}
    </div>
  );
};

export default AspectRatioSelector;
