import React, { useState, useEffect } from 'react';
import { Dot } from 'lucide-react';

const ANIMATION_INTERVAL = 100;
const DEFAULT_COLOR = '#00c4cd';

const BouncingDots = ({ color = DEFAULT_COLOR }) => {
  const [dots, setDots] = useState([0, 0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.map((dot, index) => 
        Math.sin(Date.now() / 300 + index * 0.5) > 0 ? -6 : 0
      ));
    }, ANIMATION_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center py-2">
      {dots.map((translateY, i) => (
        <div
          key={i}
          className="mx-1 transition-transform duration-300"
          style={{
            transform: `translateY(${translateY}px)`,
            color: color
          }}
        >
          <Dot size={24} />
        </div>
      ))}
    </div>
  );
};

export default BouncingDots;