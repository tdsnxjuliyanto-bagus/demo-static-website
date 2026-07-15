# Portfolio — Static + Serverless (Astro + GSAP on Azure Static Web Apps)

A scrollytelling CV and portfolio themed **“The Blueprint That Builds Itself”** for a Cloud Solution Architect.

The website is 100% static using prerendered Astro, with a small amount of **serverless** functionality through Azure Static Web Apps managed functions for the contact form, pricing tool, and view counter.

Certificates are resolved **at build time** from Credly and Microsoft Learn instead of being fetched at runtime.

The **“Ask My CV”** chatbot is intentionally reserved for **Phase 2**, with its placeholder already included in Scene 6.

This architecture is designed to run within the **Azure Static Web Apps Free plan ($0)**, which includes HTTPS, custom domains, security headers, and managed functions.

---

## 1. Prerequisites

* Node.js 18 or later
* Node.js 20 or later is recommended
* GitHub account
* Azure account

The Azure Static Web Apps Free plan is sufficient for this project.

## 2. Run Locally

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # output is generated in ./dist
npm run preview    # preview the production build
```

> The `api/` directory contains Azure Static Web Apps managed functions and is not bundled with Astro.

To run the managed functions locally, install the Azure Static Web Apps CLI:

```bash
npm install -g @azure/static-web-apps-cli
```

Build the Astro application:

```bash
npm run build
```

Then start the application with the API:

```bash
swa start dist --api-location api
```

## 3. What You Need to Edit

Search for `EDIT:` throughout the codebase.

All placeholders are centralized to make the portfolio easier to customize.

| Item                                                          | Location                                                      |
| ------------------------------------------------------------- | ------------------------------------------------------------- |
| Name, role, contact details, domain, CV, and Open Graph image | `src/data/profile.js`                                         |
| Career timeline used in the Scene 3 pipeline                  | `src/data/experience.js`                                      |
| Areas of expertise used in Scene 2                            | `src/data/expertise.js`                                       |
| Case studies and projects used in Scene 4                     | `src/data/projects.js`                                        |
| Credly username and Microsoft Learn certification list        | `src/data/certs.js`                                           |
| Domain for canonical URLs and sitemap                         | `astro.config.mjs`, `public/robots.txt`, and `profile.domain` |

Placeholders use the `[ ... ]` pattern.

As long as a value still begins with `[`, the corresponding item will either be automatically hidden or display a guidance message.

### Fonts and Assets

Place three `.woff2` font files in:

```text
public/fonts/
```

See `public/fonts/README.txt` for the expected filenames and configuration.

If the fonts are not available, the browser will fall back to `system-ui`.

Place the following files in:

```text
public/assets/
```

Required assets:

```text
og-cover.jpg
CV-[NAME].pdf
```

Recommended Open Graph image dimensions:

```text
1200 × 630 pixels
```

Before publishing, remove unnecessary metadata from the image and PDF files, including EXIF and PDF document metadata.

Replace the default favicon with your initials:

```text
public/favicon.svg
```

## 4. Project Structure

```text
portfolio/
├── astro.config.mjs
├── staticwebapp.config.json      # security headers, routes, and 404 handling
├── package.json
├── src/
│   ├── data/                     # all content and placeholders
│   ├── lib/fetchCerts.mjs        # build-time Credly and Microsoft Learn fetch
│   ├── layouts/Base.astro        # page head, SEO, and JSON-LD
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   └── scenes/
│   │       └── Scene0..Scene6    # seven storytelling scenes
│   ├── scripts/story.js          # GSAP pin, scrub, reveal, and form logic
│   ├── styles/global.css         # design tokens, themes, and blueprint styling
│   └── pages/
│       ├── index.astro
│       └── 404.astro
├── api/                          # Azure managed functions
│   ├── contact/
│   ├── pricing/
│   ├── views/
│   └── shared/                   # utilities and Table Storage client
├── public/
│   ├── fonts/
│   ├── assets/
│   ├── favicon.svg
│   └── theme-init.js
└── .github/
    └── workflows/
        └── deploy.yml            # CI/CD and scheduled rebuild
```

## 5. Deploy to Azure Static Web Apps

### 5.1 Push the Repository to GitHub

Create a GitHub repository and push the project:

```bash
git init
git add .
git commit -m "Initial portfolio deployment"
git branch -M main
git remote add origin https://github.com/[USERNAME]/[REPOSITORY].git
git push -u origin main
```

### 5.2 Create the Static Web App

In the Azure Portal:

1. Select **Create a resource**.
2. Search for **Static Web App**.
3. Select **Create**.
4. Choose the **Free** hosting plan.
5. Connect the Static Web App to the GitHub repository.
6. Select the `main` branch.

Use the following build configuration:

| Setting         | Value  |
| --------------- | ------ |
| App location    | `/`    |
| API location    | `api`  |
| Output location | `dist` |

Azure can automatically create a GitHub Actions workflow.

Alternatively, use the existing workflow:

```text
.github/workflows/deploy.yml
```

### 5.3 Configure the Deployment Token

Store the Azure Static Web Apps deployment token in GitHub:

1. Open the GitHub repository.
2. Go to **Settings**.
3. Select **Secrets and variables**.
4. Select **Actions**.
5. Create a new repository secret.

Use this secret name:

```text
AZURE_STATIC_WEB_APPS_API_TOKEN
```

Every push to the `main` branch will automatically trigger a new build and deployment.

```bash
git push origin main
```

Azure Static Web Apps provides HTTPS, custom-domain support, global content delivery, security headers, and managed functions without requiring a separate web server.

## 6. Environment Variables

Configure application settings from:

```text
Azure Portal
└── Static Web App
    └── Environment variables
```

See the following file for the available variables:

```text
api/.env.example
```

### Storage Configuration

```text
TABLES_CONNECTION_STRING
```

This connection string is used for:

* Contact-form submissions
* API rate limiting
* Pricing cache
* View counter

Without this setting, the functions can still run, but storage-backed functionality will be disabled.

The contact form can fall back to email or a `mailto` link when storage is unavailable.

### Email Configuration

```text
RESEND_API_KEY
CONTACT_TO
CONTACT_FROM
```

These variables are used to send contact-form notifications.

Email delivery is optional.

You may use any compatible email provider or replace the `sendEmail()` implementation in:

```text
api/contact/index.js
```

The implementation can also be replaced with Azure Communication Services Email.

## 7. Security Configuration

The project includes security controls through:

```text
staticwebapp.config.json
```

Configured security headers include:

* Content Security Policy
* HTTP Strict Transport Security
* `X-Content-Type-Options`
* `X-Frame-Options`
* `Referrer-Policy`
* `Permissions-Policy`

The Content Security Policy is configured without `unsafe-inline`.

### Client and Server Separation

Secrets are never exposed to the browser.

Email API keys and storage connection strings are stored in Azure Static Web Apps environment variables and are only accessible by the managed functions.

### Contact Form Protection

The contact endpoint includes:

* Honeypot protection
* Table Storage-based rate limiting
* Server-side input validation
* CRLF rejection to prevent email header injection
* A **store-then-send** workflow

The submission is stored before the application attempts to send an email notification.

Email delivery is treated as best effort, ensuring that a temporary email-provider failure does not automatically discard the contact message.

### Pricing Endpoint Protection

The pricing endpoint uses:

* Whitelisted Azure regions
* Whitelisted service SKUs
* No unrestricted free-text SKU lookup
* Response caching
* Graceful stale-cache fallback

### Self-Hosted Fonts

Fonts are hosted within the application:

```text
public/fonts/
```

This allows the Content Security Policy to keep the following restriction:

```text
font-src 'self'
```

When adding external services such as analytics, monitoring, or third-party widgets, update the `Content-Security-Policy` configuration in:

```text
staticwebapp.config.json
```

## 8. Housekeeping and Data Retention

Azure Table Storage does not provide built-in TTL expiration for table entities.

The `Submissions` table may contain personally identifiable information, so a retention policy should be implemented.

A recommended policy is:

* Delete contact submissions older than 90 days.
* Periodically remove expired entries from the `RateLimit` table.
* Remove obsolete pricing-cache records.
* Review stored data before changing the portfolio domain or owner.

A lightweight approach is to create a protected endpoint:

```text
/api/cleanup
```

The endpoint should require a secret token and delete entities that exceed the configured retention period.

The cleanup endpoint can be invoked from the scheduled workflow in:

```text
.github/workflows/deploy.yml
```

A weekly cron-based rebuild is already included in the workflow. A cleanup request can be added as another workflow step.

The cleanup endpoint is intentionally not included in the initial implementation to keep the first version minimal.

## 9. Phase 2 — “Ask My CV” Chatbot

A placeholder for the chatbot is already included in Scene 6:

```text
~/ask-my-cv
```

The planned implementation is an Azure managed function:

```text
api/ask/
```

The function can call a large language model and use the CV content as its grounding source.

The initial implementation does not require a vector database because the portfolio and CV content are small enough to be provided directly as controlled context.

The planned request flow is:

```text
Visitor
   ↓
Scene 6 — Ask My CV
   ↓
POST /api/ask
   ↓
Server-side prompt construction
   ↓
LLM endpoint
   ↓
Grounded response based on CV content
```

The LLM API key must remain in Azure Static Web Apps environment variables and must never be included in client-side JavaScript.

The chatbot should also implement:

* Input-length limits
* Server-side validation
* Rate limiting
* Prompt-injection handling
* A fixed grounding source
* A clear fallback when the answer is not available in the CV
* Logging without unnecessarily retaining personal prompts

The Scene 6 input can be connected to the new API endpoint without changing the existing page layout.

This feature is intentionally separated from the initial release to keep the portfolio fast, inexpensive, and focused.

## 10. License and Credits

* Astro is licensed under the MIT License.
* GSAP and ScrollTrigger are installed through npm.
* Review the current GSAP license terms before distributing the project as a reusable commercial template.
* The portfolio source code may be edited and customized for personal use.
