import React from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Typography from '@mui/material/Typography';
import '../TopBar.css';

interface TopBarProps {
  title: string;
}

const TopBar: React.FC<TopBarProps> = ({ title }) => {
  return (
    <div>
      <div className='my-flex-container'>
      <Typography variant="h5" component="h5">
        {title}
      </Typography>
      </div>
    </div>
  );
};

export default TopBar;