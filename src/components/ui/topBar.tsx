import React from 'react';

interface TopBarProps {
  title: string;
}

export default function TopBar({ title }: TopBarProps) {
  return (
    <header
      style={{
        width: '100%',
        padding: '1rem 0 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          borderBottom: '2px solid #0070f3',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontWeight: '600',
            fontSize: '20px',
            width: '100%',
            paddingBottom: '8px',
          }}
        >
          {title}
        </h2>
      </div>
    </header>
  );
}
