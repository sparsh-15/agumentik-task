import { useState } from 'react';

function ToggleSwitch({ 
  isOn, 
  onToggle, 
  disabled = false, 
  size = 'md',
  onColor = 'bg-emerald-500',
  offColor = 'bg-red-500',
  loading = false 
}) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    if (disabled || loading || isToggling) return;
    
    setIsToggling(true);
    try {
      await onToggle();
    } finally {
      setIsToggling(false);
    }
  };

  const sizeClasses = {
    sm: 'w-10 h-6',
    md: 'w-12 h-7',
    lg: 'w-14 h-8'
  };

  const thumbSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const translateClasses = {
    sm: isOn ? 'translate-x-4' : 'translate-x-1',
    md: isOn ? 'translate-x-5' : 'translate-x-1',
    lg: isOn ? 'translate-x-6' : 'translate-x-1'
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={disabled || loading || isToggling}
      className={`
        relative inline-flex items-center rounded-full transition-all duration-300 ease-in-out
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isToggling ? 'opacity-75' : ''}
        ${isOn ? onColor : offColor}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        hover:shadow-lg
      `}
      aria-pressed={isOn}
      aria-label={`Toggle ${isOn ? 'off' : 'on'}`}
    >
      {/* Toggle thumb */}
      <span
        className={`
          inline-block bg-white rounded-full shadow-lg transform transition-transform duration-300 ease-in-out
          ${thumbSizeClasses[size]}
          ${translateClasses[size]}
          ${isToggling ? 'scale-110' : ''}
        `}
      >
        {(loading || isToggling) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </span>
      
      {/* Status icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1">
        {/* Active icon */}
        <svg 
          className={`w-3 h-3 text-white transition-opacity duration-300 ${
            isOn ? 'opacity-100' : 'opacity-0'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
        
        {/* Inactive icon */}
        <svg 
          className={`w-3 h-3 text-white transition-opacity duration-300 ${
            !isOn ? 'opacity-100' : 'opacity-0'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    </button>
  );
}

export default ToggleSwitch;