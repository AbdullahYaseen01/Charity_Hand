# Helping Hand to Poor

A charity and donation web application that connects donors with verified individuals in need.

Technology stack used in this project:
- Frontend: HTML5, CSS3
- Backend: .NET Framework (Web API 2), C#
- Database: SQL Server

## Features

- **Home Page**: Hero section, how it works, featured cases, statistics, CTAs
- **Browse Cases**: Filter by category (Food, Education, Medical, Rent) and city, card grid layout, pagination
- **Submit Request**: Full form with document upload and preview
- **Login & Register**: Auth forms with validation, social login placeholders
- **About**: Mission, vision, problem statement, verification process, team section
- **Contact**: Contact form, address, email, phone, map placeholder

## Project Structure

```
/project-root
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   └── script.js          # Mobile menu, form validation, donate modal
├── images/
│   └── placeholder-case-*.svg  # Placeholder images for case cards
├── pages/
│   ├── about.html
│   ├── browse-cases.html
│   ├── contact.html
│   ├── login.html
│   ├── register.html
│   └── submit-request.html
├── index.html             # Home page
└── README.md
```

## Design

- **Colors**: Trust-inspiring blues and greens with warm accent (amber)
- **Typography**: Poppins (headings), Open Sans (body) via Google Fonts
- **Icons**: Font Awesome 6
- **Layout**: Custom CSS with Flexbox/Grid, mobile-first responsive design

## Running the Frontend

1. Open `index.html` in a browser, or
2. Use a local server (e.g., `npx serve`, `python -m http.server`, or Live Server in VS Code)

No build step required for frontend files.

## Backend + Database Setup

1. Run `database/charityhand.sql` in SQL Server.
2. Create an ASP.NET Web API (.NET Framework 4.8) app.
3. Copy backend code from `backend/CharityHand.Api`.
4. Update `CharityHandDb` connection string in `Web.config`.
5. Run the API at `http://localhost:5050`.

Frontend pages now call:
- `GET /api/cases` for loading verified cases
- `POST /api/cases` for submitting help requests
- `POST /api/cases/donation` for donation records

## Technical Notes

- **Framework**: Custom CSS for frontend UI, .NET Framework Web API for backend services
- **Accessibility**: Semantic HTML, ARIA labels, alt tags, heading hierarchy
- **SEO**: Meta tags for description and keywords on each page
- **Forms**: Client-side validation plus backend API submission
- **Database Access**: ADO.NET with parameterized SQL queries

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge). ES5+ JavaScript.

## License

MIT
