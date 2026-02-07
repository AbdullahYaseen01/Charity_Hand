# Helping Hand to Poor

A charity and donation web application frontend that connects donors with verified individuals in need. Built with semantic HTML5, custom CSS3, and vanilla JavaScript.

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

## Running the Project

1. Open `index.html` in a browser, or
2. Use a local server (e.g., `npx serve`, `python -m http.server`, or Live Server in VS Code)

No build step required—pure HTML, CSS, and JavaScript.

## Technical Notes

- **Framework**: Custom CSS (no Bootstrap)
- **Accessibility**: Semantic HTML, ARIA labels, alt tags, heading hierarchy
- **SEO**: Meta tags for description and keywords on each page
- **Forms**: Client-side validation with error styling
- **Modal**: Donate modal with basic structure (no backend integration)

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge). ES5+ JavaScript.

## License

MIT
