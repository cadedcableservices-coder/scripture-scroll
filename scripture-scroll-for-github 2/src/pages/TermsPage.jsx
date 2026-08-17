export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p className="text-xs text-parchment/50 mb-6">Last updated: [DATE — fill in when you publish]</p>

      <Section title="What this is">
        Scripture Scroll is a free, non-commercial app for reading Bible verses in a scrollable feed. It's a
        personal project, not a company or a formal product.
      </Section>

      <Section title="Bible text">
        Verse text is from the World English Bible (WEB), which is in the public domain. Background video comes
        from royalty-free stock sources (Pexels) under their standard license.
      </Section>

      <Section title="No warranty">
        This app is provided "as is," with no guarantee it will always be available, accurate, or error-free.
        Verse text should not be treated as a substitute for a study Bible or pastoral guidance on matters of
        interpretation.
      </Section>

      <Section title="Limitation of liability">
        To the fullest extent permitted by law, the operator of this app is not liable for any damages arising
        from your use of it.
      </Section>

      <Section title="Contact">
        Questions about these terms, or a request related to content in the app, can go to
        [YOUR CONTACT EMAIL].
      </Section>

      <Section title="Changes">
        These terms may change as the app changes. Continued use after a change means you accept the new terms.
      </Section>

      <p className="mt-8 text-xs text-parchment/40">
        This is a starting-point document, not legal advice. If this app grows beyond a small personal/free
        project, have a lawyer review this before relying on it.
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

export function LegalLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-ink px-6 py-10 text-parchment">
      <div className="mx-auto max-w-xl">
        <a href="/" className="text-xs text-gold/70 mb-6 inline-block">
          ← Back to app
        </a>
        <h1 className="font-display text-3xl mb-6">{title}</h1>
        {children}
      </div>
    </div>
  );
}
