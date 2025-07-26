const config = {
  plugins: {
    '@tailwindcss/postcss': {
      config: {
        content: ['./src/**/*.{js,ts,jsx,tsx}', './src/**/*.css'],
        exclude: ['./src/**/*.module.css'],
      },
    },
    autoprefixer: {},
  },
};

export default config;
