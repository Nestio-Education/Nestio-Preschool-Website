# SpacECE Landing Pages

This repository contains a collection of static landing pages for SpacECE and related education-focused brands. It is used to manage campaign pages, admission funnels, program promotions, and lead-generation websites in one place.

Each landing page is primarily built with plain `HTML`, `CSS`, and `JavaScript`, making the projects lightweight, easy to maintain, and simple to run without a complex build setup.

## Repository Overview

The repository includes separate landing pages for different goals, such as:

- preschool admissions
- teacher training programs
- parental toddler programs
- kids learning bundles
- newsletter subscriptions
- brand-specific preschool websites

## Included Landing Pages

| Folder | Purpose |
|---|---|
| `newsletter/` | Newsletter subscription landing page |
| `Nestio-Preschool/` | Nestio Preschool brand landing page |
| `Preschool_Landing_page/` | SpacECE preschool-focused landing page |
| `Teacher-Training_Program/` | Teacher training program promotion page |
| `Preschool-admission-landing/` | Preschool admissions landing page |
| `kids_bundle_book/` | Kids learning bundle sales and promotion page |
| `Parental-Toodlar-Program/` | Parental toddler program landing page |

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Static image assets (`.png`, `.jpg`, `.jpeg`, `.webp`)

## Project Structure

```text
landing-pages/
├── README.md
├── newsletter/
├── Nestio-Preschool/
├── Preschool_Landing_page/
├── Teacher-Training_Program/
├── Preschool-admission-landing/
├── kids_bundle_book/
└── Parental-Toodlar-Program/
```

Most folders generally follow this structure:

- `index.html` - main landing page markup
- `style.css` - styling
- `script.js` - interactions and client-side behavior
- `assets/`, `images/`, or `img/` - media files

Some folders also include optimized production assets, such as:

- `style.min.css`
- `script.min.js`
- folder-specific `README.md`

## Running Locally

You can preview any landing page locally in two simple ways.

### Option 1: Open Directly in the Browser

Open the target folder's `index.html` file in your browser.

### Option 2: Use a Local Server

The recommended approach is to start a simple local server from the repository root:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Examples:

- `http://localhost:8000/newsletter/`
- `http://localhost:8000/Nestio-Preschool/`
- `http://localhost:8000/Preschool-admission-landing/`

## Working on a Page

1. Go to the folder of the landing page you want to update.
2. Edit `index.html` for content and layout changes.
3. Edit `style.css` for design and styling updates.
4. Edit `script.js` for interactions or form-related behavior.
5. Verify the page locally in the browser.

## Deployment Notes

Since these are static websites, deployment is straightforward. Any individual landing page folder can be deployed to a static hosting platform such as:

- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting
- Nginx or Apache static hosting

In most cases, you only need to upload the files from the specific landing page folder you want to publish.

## Maintenance Tips

- Keep asset paths relative so folder-based deployment remains simple.
- Optimize images, especially for hero sections and above-the-fold content.
- If a page uses minified production assets, regenerate them after editing the source files.
- Verify contact details, CTA links, form actions, and social links before publishing.
- Test each page on both desktop and mobile screens.

## Recommended Workflow

```bash
git checkout -b feature/update-landing-page
git add .
git commit -m "feat: update landing page content and styling"
```

## Notes

- Some subfolders include their own `README.md` files with page-specific details.
- Folder names are preserved according to the current project structure, so the same names should be used for deployment and references.

## License

This project is maintained for SpacECE and related brand assets. It is best to get owner or team approval before reusing or redistributing the content.
