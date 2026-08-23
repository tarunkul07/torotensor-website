# ToroTensor enterprise website

Static, multi-page website for ToroTensor Technologies Pvt Ltd.

## Positioning

- Primary offer: Enterprise AI Enablement
- Secondary offer: AI workflow automation and document intelligence
- Lead journey: readiness briefing → tailored program → workflow discovery → focused pilot
- The workflow demo uses fictional sample data and is not presented as a client deployment

## Local preview

From this directory, run:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

## Deployment

The site has no build step. Upload the directory contents as the static site root. For Cloudflare Pages, use no framework preset, leave the build command empty, and set the output directory to the project root.

## Enquiry form

The contact form uses a transparent `mailto:` fallback and opens a prepared message to `info@torotensor.com`. It does not claim successful submission without a backend. Replace this with a secure form endpoint or CRM integration later if required.
