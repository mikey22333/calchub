# All-in-One Calculator Hub

A responsive, fast, and SEO-optimized calculator website built with React.js and Tailwind CSS. This website provides a wide range of calculators for various categories including finance, math, health, unit conversion, and more.

## Features

- **Responsive Design**: Works on all devices from mobile to desktop
- **Fast Performance**: Built with React and optimized for speed
- **SEO-Friendly**: Each calculator has its own dedicated page with relevant metadata
- **Dark Mode**: Toggle between light and dark themes
- **Multiple Calculator Categories**:
  - Basic & Scientific
  - Finance & Business
  - Math Tools
  - Unit & Measurement
  - Health & Fitness
  - Date & Time
  - Education
  - Stats & Data
  - Fun & Utility
- **AdSense Integration**: Placeholders for Google AdSense ads

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/calculator-hub.git
   cd calculator-hub
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production build, run:

```bash
npm run build
# or
yarn build
```

The build files will be in the `dist` directory.

## Deployment

This project can be easily deployed to Vercel, Netlify, or any other static site hosting service.

### Deploying to Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy

### Deploying to Netlify

1. Create a `netlify.toml` file in the root directory with the following content:
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```
2. Push to a Git repository
3. Connect the repository to Netlify

## Project Structure

```
/src
  /components
    /layout          # Header, Footer, Layout components
    /calculators
      /finance       # Finance calculators
      /math          # Math calculators
      /health        # Health calculators
      /unit          # Unit conversion calculators
      /dateTime      # Date and time calculators
      /education     # Education calculators
      /stats         # Statistics calculators
      /fun           # Fun and utility calculators
  /context           # React context for theme, etc.
  /pages             # Page components
  /utils             # Utility functions
```

## Adding New Calculators

To add a new calculator:

1. Create a new component in the appropriate category folder
2. Add the route in `App.jsx`
3. Add a link to the calculator on the homepage or category page

## License

MIT

## Acknowledgements

- React.js
- Tailwind CSS
- React Router
- Vite
