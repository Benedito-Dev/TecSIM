import React from 'react';

const BackgroundEffects = () => {
  return (
    <>
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200 opacity-30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200 opacity-20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 animate-pulse-slow animation-delay-3000"></div>
    </>
  );
};

export default BackgroundEffects;