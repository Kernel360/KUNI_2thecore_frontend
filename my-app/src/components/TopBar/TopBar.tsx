import React from "react";

interface TopBarProps {
  title: string;
}

const TopBar: React.FC<TopBarProps> = ({ title }) => {
  return (
    <div style={{ background: '#1976d2', color: 'white', padding: '16px', fontSize: '1.5rem', fontWeight: 'bold' }}>
      {title}
    </div>
  );
};

export default TopBar;