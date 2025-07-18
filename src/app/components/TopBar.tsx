import React from "react";

interface TopBarProps {
  title: string;
}

const TopBar: React.FC<TopBarProps> = ({ title }) => {
  return (
    <div className="topbar-container">
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-underline" />
    </div>
  );
};

export default TopBar;