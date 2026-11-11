# orbitprep frontend refresh

This update refreshes the existing React/Vite frontend with a techy, whimsical visual style while keeping the current backend API routes and data shape.

## Run locally

1. Open a terminal in this `Frontend` folder.
2. Run `npm install` if dependencies are not installed or the existing `node_modules` came from another operating system.
3. Run `npm run dev`.
4. Open the local URL Vite prints (typically http://localhost:5173).

The frontend expects the existing backend at `http://localhost:3000`.

## Main changes

- Redesigned login and registration pages.
- Redesigned dashboard with job description, resume upload, profile notes, recent reports, and tips.
- Redesigned report page with technical questions, behavioral questions, roadmap, match score, skill gaps, and resume PDF download.
- Added form validation and visible request errors.
- Improved empty/loading states and responsive styling.
- Kept the existing API endpoints and response property names.

This is a frontend update only. MongoDB Atlas, Gemini API configuration, backend availability, and browser cookie/CORS settings still need to be configured and tested separately. Do not put API keys or database credentials in frontend files.
