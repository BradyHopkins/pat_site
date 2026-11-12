# Pat's Educare Centre - Website

A static HTML/CSS/JS site for Pat's Educare Centre, with Supabase used for authentication and the contact form.

## Project Structure

```
WDP371_Pat/
├── index.html          Home page (static service cards)
├── about.html           About page, Why Choose Us, Educare Hours, 2026 Fee Structure
├── services.html        Services page (static service cards)
├── contact.html          Contact form + FAQ section
├── login.html            Login / Sign up (Supabase auth)
├── privacy.html, terms.html
├── style.css              Site-wide styles
├── js/
│   ├── supabase-client.js  Supabase connection (shared)
│   ├── auth.js              Login, sign up, forgot password
│   ├── contact.js            Contact form submission
│   ├── home.js                Home page cards (local data, no Supabase)
│   └── services.js             Services page cards (local data, no Supabase)
├── font/                    Custom fonts
└── *.png, *.jpg              Images
```

## Running the Site

This is a plain static site - no build step needed. Because the pages use ES modules
(`<script type="module">`), open it through a local server rather than double-clicking
the HTML files (browsers block module imports on `file://`).

Easiest options:
- VS Code "Live Server" extension - right click `index.html` → Open with Live Server
- Or from the project folder: `npx serve .` / `python3 -m http.server`

## What Changed in This Update

1. **Home & Services cards** no longer fetch from Supabase - they render from local
   data in `home.js` / `services.js`. This fixed the "loading services..." bug.
2. **Login page** now has a "Forgot Password?" link, and the heading no longer sits
   behind the nav bar.
3. **Contact page** - removed a duplicate map image, added a FAQ section.
4. **About page** - thinner card borders, integrated the new write-up copy (Why Choose
   Us, Educare Hours), and added the 2026 Fee Structure section.

## Sharing the Supabase Project With Your Team

The site's Supabase project handles authentication and the `contact_submissions` table.
Here's how to get the rest of the team set up.

### 1. Invite team members to the project

- Log in to [supabase.com](https://supabase.com) and open the project.
- Go to **Project Settings → Team**.
- Click **Invite member**, enter their email, and pick a role:
  - **Owner** - full control, billing access (keep this to 1-2 people).
  - **Administrator** - can manage settings and data, no billing.
  - **Developer** - can read/write data and edit code-adjacent settings, can't change
    dangerous project settings.
- They'll get an email invite and need to accept it to join the org.

### 2. Share the API keys

- The public URL and anon key are already in `js/supabase-client.js` in this repo -
  once a teammate is invited to the project, they automatically have access to view
  these in **Project Settings → API**, so there's no need to send keys over Slack/email.
- Never share the **service_role** key outside the Supabase dashboard - it bypasses
  Row Level Security and should never be used in front-end code.

### 3. Keep the database schema in sync

The two tables the site depends on are `contact_submissions` and (for future features)
`users`. To keep everyone's local understanding of the schema in sync:

- Use the **Table Editor** in the dashboard as the source of truth - since everyone is
  invited to the same project, there's only one database, so there's nothing to
  "sync" locally, but it helps to document schema changes.
- For bigger schema changes, write them up as SQL and run them through the
  **SQL Editor**, then paste the SQL into a shared doc or commit it to a `/sql` folder
  in the repo so there's a history of what changed and why.
- Turn on **Database → Backups** so schema/data mistakes are recoverable.

### 4. Team workflow tips

- Treat the Supabase dashboard like a shared server, not a personal dev environment -
  changes made there (new columns, RLS policies) affect everyone immediately.
- Agree on one person to own RLS policy changes, since a wrong policy can lock
  everyone out of a table or expose data publicly.
- Use Supabase's **Logs** section to debug auth/API issues instead of guessing -
  it shows the exact request and error for both auth and database calls.
- When testing locally, use a separate test account (not a shared login) so you don't
  interfere with teammates' sessions.
