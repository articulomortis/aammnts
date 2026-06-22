# aammnts

Minimal portfolio for [aammnts.com](https://aammnts.com).

## Stack

- [Astro](https://astro.build)
- Inter (`@fontsource/inter`)
- Lenis + GSAP for scroll and reveal animations
- View Transitions for page navigation

## Local development

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Edit content

All copy lives in `src/content/site.ts`.

- Landing: `intro`, `experience`, `about`
- Longread: `detailsSections`

## Deploy (GitHub Pages + custom domain)

1. Create a new GitHub repository named `aammnts` under `articulomortis`.
2. Push this project:

```bash
git remote add origin git@github.com:articulomortis/aammnts.git
git push -u origin main
```

3. In GitHub → **Settings → Pages**:
   - Source: **GitHub Actions**
4. Add DNS records for `aammnts.com`:
   - `A` records → GitHub Pages IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - or `CNAME` `www` → `articulomortis.github.io` (if using www)
5. In Pages settings, set custom domain to `aammnts.com` and enable HTTPS.

`public/CNAME` is already set to `aammnts.com`.

## Placeholders

- CV link is disabled until you add a PDF to `public/` and update `Header.astro`.
- Longread images can be added later in `src/pages/details/index.astro` or content file.
