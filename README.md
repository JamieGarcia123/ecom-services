# Ecommerce Services Platform

A modern React-based platform for discovering and booking wellness and lifestyle services. Built with React, TypeScript, Vite, TailwindCSS, and Supabase.

## 🚀 Features

- **Service Discovery**: Browse and search wellness services with filtering by category
- **Service Management**: Providers can add, edit, and delete their services
- **Image Support**: Upload service images or provide image URLs
- **Real-time Database**: Powered by Supabase with PostgreSQL
- **Responsive Design**: Mobile-first design with TailwindCSS
- **TypeScript**: Full type safety throughout the application
- **Modern Build Tools**: Vite for fast development and optimized builds

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Routing**: React Router v6
- **Styling**: TailwindCSS v4
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage for images
- **Deployment**: Netlify

## 📋 Prerequisites

Before running this application locally, ensure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Supabase account** (free tier available)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://gitlab.com/wgu-gitlab-environment/student-repos/Jamie_Garcia_9124/d424-software-engineering-capstone.git
cd d424-software-engineering-capstone
git checkout ecommerce-services
```

### 2. Install Dependencies

```bash
npm install
```


### 3. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── main.tsx                 # Application entry point
└── app/
    ├── app.css             # Global styles
    ├── components/
    │   ├── Header.tsx      # Navigation header
    │   └── ItemCard.tsx    # Service card component
    ├── data/
    │   ├── supabaseManager.ts    # Database operations
    │   ├── dataManager.ts        # Data interface
    │   └── items.ts             # Type definitions
    ├── routes/
    │   ├── home.tsx             # Homepage
    │   ├── services.tsx         # Services listing
    │   ├── service.$serviceId.tsx # Service detail page
    │   ├── add-service.tsx      # Add new service
    │   ├── provider-dashboard.tsx # Provider management
    │   └── login.tsx           # Login page
    └── landing/
        └── landing.tsx         # Landing page component
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run lint` - Run ESLint


## 🎯 Usage

### For Service Seekers
1. Visit the homepage to see featured services
2. Browse all services on the Services page
3. Use search and category filters to find specific services
4. Click on any service to view detailed information

### For Service Providers
1. Navigate to Provider Dashboard
2. Add new services with title, description, price, duration, and images
3. Edit existing services
4. Delete services you no longer offer

## 🧪 Testing

This project includes unit tests to ensure code quality and functionality:

```bash
# Run tests once
npm run test:run

# Run tests in watch mode (for development)
npm test
```

The test suite includes:
- **Utility function tests**: Price formatting, duration formatting, data validation
- **Component tests**: React component rendering and user interactions
- **Integration tests**: Database operations and API interactions

Current test coverage includes 25+ tests covering critical application functionality.

## 🐛 Troubleshooting

### Common Issues

**1. Environment Variables Not Loading**
- Ensure your `.env.local` file is in the root directory
- Variable names must start with `VITE_`
- Restart the development server after changing environment variables

**2. Database Connection Issues**
- Verify your Supabase URL and anon key are correct
- Check that your Supabase project is active
- Ensure RLS policies are properly configured

**3. Images Not Displaying**
- For uploaded images, ensure the `service-images` bucket exists and is public
- For image URLs, ensure the URL is accessible and the image format is supported

**4. Build Errors**
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors with `npm run type-check`
- Clear node_modules and reinstall if issues persist

### Development Tips

- Use the browser's developer tools to check for console errors
- Monitor the Network tab for failed API requests
- Check Supabase logs in the dashboard for database issues

##  Deployment

This application is configured for deployment on Netlify. The build process creates static files that can be served from any web server.

### Environment Variables for Production
Make sure to set these environment variables in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## License

This project is for educational purposes as part of a university capstone project.

## Contributing

This is a capstone project. For issues or questions, please contact the project maintainer.

---

Built with React, TypeScript, Vite, TailwindCSS, and Supabase.