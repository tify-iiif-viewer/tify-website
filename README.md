# TIFY Website

This is the source of [TIFY’s official website](https://tify.rocks).

## Requirements

[Node.js](https://nodejs.org/en/) v16 or later with npm.

Until TIFY v0.25.0 is released, the `tify` directory must be on the same file tree branch as `tify-website`, including `dist` compiled from the git branch `next`.

- `/`
  - `tify-website`
  - `tify` (including `dist`)

## Development

- Project setup: `npm install`
- Compile and hot-reload: `npm run serve`
- Build for production: `npm run build`
- Lint and fix files: `npm run lint`
