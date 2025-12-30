import React from 'react';

export default function WaveDivider({ flip = false }) {
  return (
    <div
      aria-hidden="true"
      style={{
        lineHeight: 0,
        transform: flip ? 'rotate(180deg)' : 'none',
        margin: '24px 0 -12px 0'
      }}
    >
      <svg
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '80px' }}
      >
        <defs>
          <linearGradient id="waveGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#4a90e2" />
            <stop offset="100%" stopColor="#50c9c3" />
          </linearGradient>
        </defs>
        <path
          d="M0,80 C240,20 480,20 720,80 C960,140 1200,140 1440,80 L1440,120 L0,120 Z"
          fill="url(#waveGrad)"
          opacity="0.25"
        />
        <path
          d="M0,70 C240,10 480,10 720,70 C960,130 1200,130 1440,70 L1440,120 L0,120 Z"
          fill="url(#waveGrad)"
          opacity="0.5"
        />
        <path
          d="M0,60 C240,0 480,0 720,60 C960,120 1200,120 1440,60 L1440,120 L0,120 Z"
          fill="url(#waveGrad)"
        />
      </svg>
    </div>
  );
}