# Compliance & Safety Notes

Written like a senior dev handing this off to you, not like a law firm. **I'm not a lawyer — this is engineering risk-reduction, not legal advice.**

## Good news: dropping comments dramatically simplifies your risk

No user-generated content means no moderation burden, no Section 230 questions, no "someone posted something awful" 2am scenario, and much lighter privacy-law exposure. This is now a much simpler, lower-risk thing to put out publicly for free.

## What's already handled

**Content licensing**
- Bible text: World English Bible, public domain — zero copyright exposure, free to redistribute however you like, commercially or not.
- Background video: Pexels API, whose license permits free use (including in apps distributed to others) without per-video attribution required. You're not scraping or redistributing anyone's copyrighted footage.

**Data & privacy**
- No accounts, no login, no comments, no analytics, no ads, no tracking scripts.
- Reading progress/streak/bookmarks live only in the visitor's own browser (localStorage) — never transmitted anywhere, never seen by you.
- The only outbound network call the app makes on a visitor's behalf is to Pexels, to fetch a background video clip.

This means there's genuinely very little personal data flowing through this app at all, which is the best privacy posture you can have.

## What's still worth doing before a public launch

1. **Fill in the Terms of Service and Privacy Policy** (`src/pages/TermsPage.jsx`, `PrivacyPage.jsx`) — replace the `[DATE]` and `[YOUR CONTACT EMAIL]` placeholders. They're intentionally short since there's no UGC to account for, but having *something* posted is good practice for any public site.
2. **Skim Pexels' license** if you ever plan to do anything commercial with it: https://www.pexels.com/license/
3. **If you ever add comments, accounts, analytics, or ads later** — revisit this document and the legal pages, since all of those meaningfully change your risk profile and what needs to be disclosed.

## If you want a private instance for yourself too

Deploy the same code a second time as a separate project/domain, and use your host's real access control (Vercel password protection, Cloudflare Access) rather than relying on an unlisted URL — that's not real security, just obscurity.
