# SmartGuard Admin Dashboard

A modern admin dashboard for monitoring and managing family subscriptions, billing, device activity, and more. Built with React, Vite, and Bootstrap.

---

## Project Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd smartguard-admin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

## Running the Application (Development)

Start the development server (default: [http://localhost:3000](http://localhost:3000)):

```bash
npm run dev
```

The app will open automatically in your browser.

---

## Building for Production

To build the optimized production bundle:

```bash
npm run build
```

The output will be in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## Test Case Validation

- **Manual Testing:**
  - Validate all dashboard features (Overview, Tenant Management, Subscriptions, Device Activity, etc.) by interacting with the UI.
  - Check API integration by verifying data loads and updates as expected.
  - Use the search, filter, and export features to ensure correct results.
  - Validate authentication and role-based access if enabled.

- **Automated Testing:**
  - _No automated test suite is currently included._
  - To add tests, consider integrating [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

---

## Deployment

### Docker (Recommended for Production)

> **Note:** No Dockerfile is included by default. To deploy with Docker, add a `Dockerfile` like below:

```Dockerfile
# Dockerfile for SmartGuard Admin Dashboard
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Then build and run:
```bash
docker build -t smartguard-admin .
docker run -p 8080:80 smartguard-admin
```

### Cloud Deployment
- You can deploy the contents of the `dist/` folder to any static hosting provider (Vercel, Netlify, AWS S3, Azure Static Web Apps, etc.).
- For custom domains or HTTPS, follow your provider's documentation.

---

## Accessing and Validating Application Use Cases

- **Overview:** View family growth, subscription distribution, and recent activity.
- **Tenant Management:** Search, filter, and manage families, children, and devices.
- **Subscriptions:** Monitor, filter, and export subscription and billing data.
- **Device Activity:** Track device usage and activity logs.
- **Authentication:** Login, signup, and password reset (if enabled).

Interact with each section to validate that:
- Data loads from the API and updates correctly.
- Filters/search/export features work as expected.
- UI/UX is responsive and visually consistent.

---

## Notes
- Environment variables (API endpoints, keys) can be set in a `.env` file (see `.env.example` if available).
- For advanced configuration, see `vite.config.js`.
- For support, open an issue or contact the project maintainer. 