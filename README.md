# Project

## Project info

This repository powers the LLMS.txt site.

## Deployment Instructions

### For cPanel/Shared Hosting:
1. Run `npm run build:prod` to create production build
2. Upload the contents of the `dist` folder to your public_html directory
3. Make sure `.htaccess` file is uploaded (it handles routing)
4. Your site should work with proper routing

### For Netlify:
1. Connect your repository to Netlify
2. Build command: `npm run build:prod`
3. Publish directory: `dist`
4. The `_redirects` file will handle routing automatically

### For Vercel:
1. Connect your repository to Vercel
2. Framework preset: Vite
3. Build command: `npm run build:prod`
4. Output directory: `dist`

## How can I edit this code?

There are several ways of editing your application.

Use your preferred workflow to make changes and push to this repository.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Production Build
```bash
npm run build:prod
```

### Deploy to cPanel/Shared Hosting
1. Build the project: `npm run build:prod`
2. Upload contents of `dist` folder to `public_html`
3. Ensure `.htaccess` is uploaded for proper routing

### Deploy to Netlify/Vercel
- Connect your repository
- Set build command to `npm run build:prod`
- Set publish directory to `dist`

## Custom domain

Configure your DNS to point to your hosting provider per their documentation.
