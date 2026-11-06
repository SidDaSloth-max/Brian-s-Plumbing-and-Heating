# Brian's Plumbing and Heating

Static website for Brian's Plumbing and Heating (148 Manor Dr, Libby, MT 59923, (206) 427-2219).
Live at https://briansplumbingheating.com/

Plain HTML, CSS and JavaScript. There is no build step and no dependencies.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | Homepage (reviews, quote form, services, gallery, map, FAQ) |
| `services.html`, `plumbing-repair-installation.html`, `water-heater-services.html`, `heating-furnace-services.html`, `emergency-plumbing.html` | Service pages |
| `plumber-troy-mt.html`, `plumber-yaak-mt.html`, `plumber-trego-mt.html` | Service-area pages |
| `about.html`, `contact.html`, `feedback.html` | Other pages |
| `thank-you.html`, `404.html` | Form confirmation and error page (both `noindex`) |
| `css/main.css`, `js/main.js` | All styling and scripts |
| `images/` | Logos, share image, icons, `gallery/` photos |
| `_headers` | Netlify cache and security headers |
| `sitemap.xml`, `robots.txt` | Search engine files |
| `google1b247dfd494841f6.html` | Google Search Console verification. **Do not delete.** |

## Deploying (Netlify)

- The site deploys from the `main` branch of `SidDaSloth-max/Brian-s-Plumbing-and-Heating`.
- Pushing to `main` triggers a deploy. There is no build command; the publish directory is this folder.
- Forms use Netlify Forms (`data-netlify` attributes). Each form has a hidden mirror form in the HTML so Netlify detects it at deploy time. Submissions are sent with `fetch` and then redirect to `/thank-you.html`.

## Cache-busting (`?v=`)

`css/main.css` and `js/main.js` are linked with a version query string, for example `css/main.css?v=20261111`.
`_headers` caches `/css/*` and `/js/*` for only 60 seconds, but the query string guarantees visitors get new files.

When you change `main.css` or `main.js`, change the `?v=` value to a new date in **every** HTML file:

```bash
sed -i 's/?v=OLDVALUE/?v=NEWVALUE/g' *.html
```

## When adding or changing a page

- Give it a unique `<title>` (60 characters or fewer) and a meta description (about 155 characters).
- Set the `canonical` URL to `https://briansplumbingheating.com/...`.
- Keep the business name, address and phone identical to every other page.
- Include the Plumber JSON-LD block and the Google Analytics tag (`G-GZ6F2VEHD2`), as on the other pages.
- Add it to `sitemap.xml` and link to it from the nav or footer.
- Link the homepage as `/`, not `index.html`.

## Analytics events

Google Analytics 4 receives `call_click`, `generate_lead` (form submissions) and `outbound_click`.
