# GitHub Actions Deployment Setup

The workflow at `.github/workflows/deploy.yml` builds the Vite frontend and API container on pushes to `main`. It publishes the API image to `ghcr.io/alfaizsamani/pragati-api` and can trigger production deployments through provider deploy hooks.

## Required GitHub repository secrets

Open the repository on GitHub, then go to **Settings -> Secrets and variables -> Actions -> New repository secret**.

### Vercel frontend

1. In the Vercel project, open **Settings -> Git -> Deploy Hooks**.
2. Create a production hook for branch `main`.
3. Add its URL in GitHub as `VERCEL_DEPLOY_HOOK`.

This hook tells the existing Vercel project to build from the pushed `main` branch. It uses the environment variables already configured in Vercel.
The URL is a secret credential; do not commit it or paste it into frontend variables. The Actions step now fails visibly if this secret is absent, and prints Vercel's non-secret hook response after a successful call.

The workflow's **Set up Node.js** step is expected: Vite is a JavaScript frontend and needs Node to install packages and run `vite build`. It does not mean that Vercel is treating the app as Next.js. The root `vercel.json` sets the Vite framework and uses `.gov` for its package and build output.

### Python API host

1. In the API hosting service, create a deploy hook for the service that builds from this repository's `Dockerfile`.
2. Add its URL in GitHub as `CONTAINER_DEPLOY_HOOK`.

The workflow calls this hook after publishing the container image. If the API host deploys directly from the Git repository instead, enable its repository auto-deploy setting and leave this secret unset.

## Container registry option

The workflow publishes a private GHCR image at `ghcr.io/alfaizsamani/pragati-api:latest` and a commit-specific tag. For a host configured to pull the GHCR image, configure registry credentials for that host. Otherwise, configure the API service to build from the repository's `Dockerfile` and use its deploy hook.

## Verification

After pushing to `main`, open the repository's **Actions** tab. The `Build and deploy PRAGATI` run should show:

- `Build Vite frontend` succeeded.
- `Build and publish API container` succeeded and pushed to GHCR.
- Vercel and API deploy-hook steps ran when their corresponding secrets are configured.

Use **Actions -> Build and deploy PRAGATI -> Trigger Vercel production deployment** to confirm the step ran and returned a deployment identifier. A green `Set up Node.js` step alone is not a deployment.
