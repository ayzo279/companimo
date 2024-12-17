import React from 'react';

interface ProgressBarProps {
  total: number;
  filled: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ total, filled }) => {
  const computeWidth = (total: number) => {
    return 12/total; 
  };

  return (
    <div className="flex justify-start w-[12vw] h-[1.5vw] border-[0.2vw] border-black rounded-2xl overflow-hidden gap-1 bg-black">
      {new Array(filled).fill(null).map((_, index) => (
        <div
          key={index}
          className="bg-mint" 
          data-testid="filled-segment"
          style={{ width: `${computeWidth(total)}vw` }} />
      ))}
        {new Array(total - filled).fill(null).map((_, index) => (
        <div
          key={index}
          className="bg-white" 
          data-testid="unfilled-segment"
          style={{ width: `${computeWidth(total)}vw` }} />
      ))}
    </div>
  );
};

export default ProgressBar;
