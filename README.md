# Prestine Apartments - React Website

A modern, responsive website for Prestine Apartments built with React, Vite, Tailwind CSS, ShadCN/UI, and Framer Motion.

## Features

- 🏠 Modern home page with animated hero section
- 🏢 Apartment listings page
- 📝 Detailed apartment pages with image carousel
- 📧 EmailJS integration for reservations
- 🎨 Beautiful UI with Tailwind CSS and ShadCN/UI
- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive design

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **ShadCN/UI** - UI components
- **Framer Motion** - Animations
- **React Router** - Routing
- **EmailJS** - Form submission
- **React Hook Form** - Form management

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── ui/          # ShadCN/UI components
│   ├── Navbar.jsx   # Navigation component
│   ├── Footer.jsx   # Footer component
│   └── ReservationForm.jsx  # Booking form
├── pages/           # Page components
│   ├── Home.jsx     # Home page
│   ├── Apartments.jsx  # Apartment listings
│   ├── ApartmentDetail.jsx  # Apartment detail page
│   └── Confirmation.jsx  # Confirmation page
├── data/            # Data files
│   └── apartments.js  # Apartment data
├── config/          # Configuration files
│   └── emailjs.js   # EmailJS configuration
└── lib/             # Utility functions
    └── utils.js     # Helper functions
```

## EmailJS Configuration

Update the EmailJS configuration in `src/config/emailjs.js` with your:
- Service ID
- Template IDs (for client and company emails)
- Public Key

## Images

Make sure to copy the `images` folder from the parent directory to the `public` directory of this project.

## License

Copyright © 2024 Prestine Apartments. All rights reserved.
