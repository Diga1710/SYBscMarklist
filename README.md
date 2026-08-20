# Student Marks Portal — GitHub Pages Version

This version does **not use Flask, Python, pandas, or a backend**. It is a fully static website made with:

- HTML
- CSS
- JavaScript
- Bootstrap 5
- SheetJS (reads the Excel file in the browser)

## Files

Keep these files in the same GitHub repository/folder:

```text
index.html
style.css
script.js
SY Bsc Vedic Internal Marklist.xlsx
```

## Run on GitHub Pages

1. Create a GitHub repository.
2. Upload all 4 files to the repository root.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select your main branch and **/ (root)**.
6. Save.
7. Wait for GitHub Pages to publish the site.
8. Open the generated GitHub Pages URL.

## Important

Do not open `index.html` directly using `file://` and expect the Excel file to load. Browsers block local `fetch()` requests for security reasons.

Use GitHub Pages, VS Code Live Server, or another HTTP server.

### Test Roll Numbers

The supplied Excel file contains Roll Nos. **501 to 554**.

Example:
`501`

## How it works

The browser loads `SY Bsc Vedic Internal Marklist.xlsx` using SheetJS, converts Sheet1 to JavaScript objects, and searches the entered Roll Number.

No server/database is required.

## Security note

This is suitable for a demonstration/college project, but the Excel file is publicly downloadable from GitHub Pages. Therefore, it should not be used for confidential student marks. For real confidential deployment, use a backend/database with authentication.
