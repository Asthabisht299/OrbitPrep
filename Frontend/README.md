# OrbitPrep — Frontend

OrbitPrep is an AI-powered interview preparation and resume-building workspace. This React application lets candidates create role-specific preparation reports from a PDF resume and/or a self-description.

## Features

- Account registration and sign-in
- Resume-based and self-description-based interview analysis
- Role alignment score and skill-gap insights
- AI-generated technical and behavioral interview questions
- A structured preparation roadmap
- Saved interview report history
- Tailored resume PDF generation

## Tech stack

- React
- React Router
- Vite
- SCSS
- Axios

## Run locally

1. Open a terminal in the `Frontend` directory.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL printed by Vite.

The backend must also be running and its API base URL must be configured in the frontend API service.

## Resume upload

The current backend resume parser accepts PDF files up to 3 MB. If a candidate does not have a resume ready, they can provide a self-description instead.

## Build

Run `npm run build` to create the production build in `dist/`.
