import { X } from "lucide-react";

/**
 * Bottom sheet listing every major narrative arc (Creation, Abraham, David,
 * the Gospel, Acts, Revelation...) so the person can jump straight to a
 * section instead of only ever moving one verse at a time.
 */
export default function BrowseSheet({ open, onClose, sections, onSelect }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={onClose}>
      <div
        className="max-h-[75vh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-gold-dim bg-ink-soft px-6 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gold-dim" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-parchment">Jump to</h2>
          <button onClick={onClose} aria-label="Close">
            <X className="h-5 w-5 text-parchment/60" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {sections.map((section) => (
            <button
              key={section.label}
              onClick={() => {
                onSelect(section.index);
                onClose();
              }}
              className="rounded-xl border border-gold-dim/40 bg-ink px-4 py-3 text-left transition-colors active:bg-ink-soft"
            >
              <span className="font-display text-sm text-parchment">{section.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
