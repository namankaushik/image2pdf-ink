# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/a8997a3b-95e9-43e4-bab8-4d26e308632f

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a8997a3b-95e9-43e4-bab8-4d26e308632f) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

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

## Deployment

### Cloudflare Pages (recommended)

- Build command: `npm ci && npm run build`
- Output directory: `dist`
- Node version: `20`
- Add custom domains: apex + www

### GitHub Pages (already configured)

- Push to `main`; workflow in `.github/workflows/deploy-pages.yml` builds and deploys `dist/`.
- Add a custom domain in repo Settings → Pages (optional).

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## AdSense

1) Apply with your domain once DNS resolves.
2) Update `public/ads.txt` with your publisher ID line:

```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

3) Configure environment variables for Vite:

```
VITE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
# Optional manual unit slots (after creating them in AdSense)
VITE_ADSENSE_SLOT_HERO=XXXXXXXXXX
VITE_ADSENSE_SLOT_PROGRESS=XXXXXXXXXX
VITE_ADSENSE_SLOT_RESULT=XXXXXXXXXX
```

The app auto-loads AdSense if `VITE_ADSENSE_ID` is set and renders ad units only when their slot IDs are present.
