# Wedding Invitation — Umesha & Waruna

A single-page wedding invitation site with a Sri Lankan traditional theme (oil lamp / *pahana*
motif, maroon & gold palette, betel-leaf dividers), a live countdown to **24 December 2026**,
and an RSVP form where guests pick **Just Me / Me & Partner / Family** before sending their
reply. Includes a private tool to generate personalized, WhatsApp-ready invite links for each
guest.

Plain HTML/CSS/JS — no build step, so it deploys to Vercel instantly.

## Files
| File | Purpose |
|---|---|
| `index.html` | The invitation guests see (names, date, venue, RSVP form) |
| `styles.css` | Theme — colors, fonts, layout |
| `script.js` | Countdown timer, RSVP logic, reads personalized `?to=&type=` links |
| `invite-generator.html` | **Private tool for you** — creates a WhatsApp-ready link per guest |

---

## PART 1 — Get the site live (repo → Vercel)

### Step 1: Create the local repo
```bash
cd wedding-invitation
git init
git add .
git commit -m "Initial commit: wedding invitation site"
```

### Step 2: Create the GitHub repository
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `wedding-invitation`
3. Keep it **empty** (no README/gitignore/license — you already have files locally)
4. Click **Create repository**

### Step 3: Push your code
GitHub will show you these commands after creating the repo — run them:
```bash
git remote add origin https://github.com/YOUR_USERNAME/wedding-invitation.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → sign in with GitHub
2. Click **Add New → Project**
3. Select **Import** next to your `wedding-invitation` repo
4. Framework Preset: **Other** (static HTML — no build command needed)
5. Click **Deploy**
6. In ~30 seconds you'll get a live URL, e.g. `https://wedding-invitation.vercel.app`

That URL is what you'll use in Part 2 below.

### Step 5 (optional): custom domain
Vercel project → **Settings → Domains** → add your own domain and follow the DNS steps shown.

Every future `git push` to `main` auto-redeploys — so you can fix a typo or update the venue
right up until the big day.

---

## PART 2 — Send personalized invitations over WhatsApp

Open **`invite-generator.html`** on your deployed site, e.g.:
```
https://wedding-invitation.vercel.app/invite-generator.html
```
This page is for you only (it's excluded from search engines) — guests never see it.

For each guest or family:
1. Paste your site URL (once).
2. Type the guest's name — this makes the invitation greet them personally: *"Dear [Name],"*
3. Choose **Just Them / Them & Partner / Family** — this pre-selects that option on their RSVP
   form so it's already filled in when they open the link.
4. Optionally paste their WhatsApp number (with country code, digits only, e.g. `94771234567`)
   so the share button opens a chat with them directly. Leave it blank to just pick any WhatsApp
   contact yourself.
5. Click **Generate Link**, then **Open in WhatsApp →**. A message like this is pre-filled and
   ready to send:

   > Dear Kavindi Perera, 💛
   > Umesha & Waruna joyfully invite you to their wedding on 24th December 2026!
   > View your invitation and RSVP here:
   > https://wedding-invitation.vercel.app/?to=Kavindi%20Perera&type=two

6. Repeat for everyone on your guest list. Keeping a simple spreadsheet (Name, Type, Phone)
   makes it quick to work through the whole list in one sitting.

When a guest opens their link, they'll see their name in the invitation and their seat count
already selected on the RSVP form — they just confirm and submit.

---

## Customizing
- **Names / date / venue**: edit the text directly in `index.html`.
- **Colors**: change the hex values under `:root` at the top of `styles.css`.
- **RSVP deadline**: search for "15th November 2026" in `index.html`.
- **Countdown target**: update the date string in `script.js` (`WEDDING_DATE`).
- **Receiving RSVP replies by email**: see the comment inside the `submit` handler in
  `script.js` — uncomment the `fetch(...)` block and connect a free [Formspree](https://formspree.io)
  endpoint to get every RSVP emailed to you.
