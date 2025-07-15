import React from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Typography from '@mui/material/Typography';

export default function Home() {
  return (
    <div>
      <Typography variant="h1" component="h2">
        Hello, Material UI!
      </Typography>
    </div>
  );
}
