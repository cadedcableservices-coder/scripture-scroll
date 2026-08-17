import { LegalLayout } from "./TermsPage";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p className="text-xs text-parchment/50 mb-6">Last updated: [DATE — fill in when you publish]</p>

      <Section title="Short version">
        This app doesn't require an account, doesn't collect your email or personal information, and doesn't
        run tracking/advertising scripts. Your reading progress, streak, and bookmarks are stored only on your
        own device (browser local storage) and are never sent anywhere.
      </Section>

      <Section title="Background video">
        Background video clips are fetched from Pexels' public API. Pexels may log standard web request data
        (like IP address) as part of serving that request — see Pexels' own privacy policy for details.
      </Section>

      <Section title="Children's privacy">
        This app is intended for a general audience and is not directed at children under 13. We don't
        knowingly collect personal information from children — in fact, this app doesn't knowingly collect
        personal information from anyone.
      </Section>

      <Section title="Changes">
        This policy may be updated as the app changes. Material changes will be reflected by updating the date
        above.
      </Section>

      <p className="mt-8 text-xs text-parchment/40">
        This is a starting-point document, not legal advice. If you add comments, accounts, analytics, or ads
        later, this policy will need to be expanded and reviewed accordingly.
      </p>
    </LegalLayout>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <h2 className="font-display text-lg text-gold mb-1">{title}</h2>
      <p className="text-sm leading-relaxed text-parchment/80">{children}</p>
    </div>
  );
}
