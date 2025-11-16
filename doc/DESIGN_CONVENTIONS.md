Recruiter Website Design System v2.2 — Merged & Comprehensive
Purpose: Give clear, flexible, and practical visual rules so pages are readable, attractive, and consistent. This guide provides both high-level principles and specific implementation details for layout, typography, spacing, and responsive behavior, based on real-world best practices.

📋 Table of Contents
Core problem

Principles (non-negotiable)

Highlight guidance (conceptual + practical)

Color & state guidance

Typography & spacing (conceptual + practical)

Info rows & metadata

Buttons & CTAs

Badges & states

Components (behavioral)

Responsive rules (Critical UX improvements)

Checklist

Notes

🎯 Core problem
This section is preserved from v2.0 for context.

Problems we fix:

Pages that feel flat or “all white”

Lack of visual hierarchy

Tiny unreadable body text on larger screens

Overly saturated state colors and heavy badge styles

Non-responsive typography and spacing

🔥 Principles (Non-Negotiable)
This is a merged list of the strongest principles from both versions.

Highlight First: Every page must include a clear, prominent highlight area near the top to establish hierarchy (e.g., stats, profile header, title + CTA).

Readable Body: Body copy minimum is 16px (or platform equivalent) on all devices. Smaller sizes are only for labels, metadata, or helper text.

Responsive Typography: Typography must scale responsively—headings and key UI text must adapt their size between breakpoints.

Primary vs. Secondary: Primary actions (e.g., "Apply Now") must be visually dominant. Secondary actions (e.g., "View Details") must be subtle (like links), not equal-weight buttons, especially on mobile.

No Mobile Horizontal Scroll: Info rows and metadata must wrap on mobile, not create horizontal scroll (flex-wrap).

Consistent Badges: Badges should be understated (subtle backgrounds or bordered styles) and must use an enum-to-label mapping for consistency.

Tappable Mobile CTAs: Buttons on narrow screens must be easy to tap (usually full-width for primary, link-style for secondary).

🎨 Highlight guidance (conceptual + practical)
Combines the 'why' from v2.0 with the 'how' from v2.1.

Conceptual Purpose:

Create a clear focal zone that lifts important content (overview, title + CTA, profile summary).

Behavior: consistent container concept across pages, but content inside is dynamic per page type.

Visuals: choose a primary accent (e.g., a rich blue) for highlights; ensure text inside the highlight remains legible (light on dark or dark on light).

Practical Implementation:

Always visually distinct (e.g., gradient, accent color, or soft background).

Responsive padding and font sizes:

Heading: text-xl (mobile), sm:text-2xl, md:text-4xl

Subheading: text-sm (mobile), sm:text-base, md:text-lg

Stats: text-base (mobile), sm:text-lg, md:text-2xl

Never "banner squeeze": always show part of the next section above the fold.

🎨 Color & state guidance
This section is preserved from v2.0.

Primary accent: choose a single rich hue for highlights and primary actions.

Backgrounds: neutral page background with white or light-surface cards.

States: use soft/pastel fills with stronger text color for contrast.

Accessibility: maintain sufficient contrast for text and interactive controls.

🅰️ Typography & spacing (conceptual + practical)
Combines the 'why' from v2.0 with the 'how' from v2.1.

Conceptual Principles:

Headings: responsive sizes (smaller on mobile, larger on desktop).

Spacing: responsive padding/margins; scale components rather than keeping fixed pixel values across breakpoints.

Practical Sizing:

Body text: text-base (16px) minimum.

Headings: Responsive (text-lg/text-xl/text-2xl/text-3xl/text-4xl).

Labels, metadata: text-xs or text-sm as appropriate.

Inputs/buttons: text-sm (mobile), sm:text-base (desktop).

Spacing: Use responsive padding/margins (px-4 py-4, sm:px-6, etc.).

🏷️ Info Rows & Metadata
This practical section is inserted from v2.1.

Never use horizontal scroll for info rows on mobile.

Use flex flex-wrap gap-x-4 gap-y-1 for info rows.

Each item: flex items-center min-w-0 with icon and label.

On mobile, info wraps to 2–3 lines as needed, never overflows or hides content.

🔘 Buttons & CTAs
This practical section is inserted from v2.1.

Primary CTA: Always full-width on mobile, inline on desktop.

Secondary CTA: Always a subtle link (e.g., blue text, underline on hover), never a full-width button on mobile.

Never place two equal-weight buttons side-by-side on mobile.

Disabled states use soft colors and clear icons.

🏷️ Badges & States
This practical section is inserted from v2.1.

Use enums for job types/statuses, and always map to human-friendly labels.

Badges: border, bg-blue-50, text-blue-700, text-xs or sm:text-sm.

No solid, saturated badge backgrounds.

🧩 Components (behavioral)
This section is preserved from v2.0 for conceptual guidance.

Stat cards: visually grouped in the highlight (contrast may be inverted as needed).

Profile header: placed in the highlight and not forced into a white card inside the highlight.

Tables: visually contained in surface cards below the highlight; rows should have clear hover/focus states and pagination when long.

Badges & states: minimal, bordered or soft-filled; avoid saturated solid bubbles. (Note: this is reinforced by the practical section above).

📱 Responsive Rules (Critical UX Improvements)
This is the full, detailed responsive section from your original v2.1 document, as it is the most comprehensive.

These rules fix the typical AI/automatic-responsive problems where layout changes but UX becomes worse (e.g., search taking the whole screen, sidebar moved to top unchanged, etc.).

1. Sidebars on desktop must not become giant top bars on mobile
Incorrect: taking a full-height search/filter sidebar and simply placing it above content.

Correct mobile behavior:

convert sidebar into:

a modal

a drawer (left or right)

a bottom sheet

a collapsible accordion

the element becomes summoned, not permanently visible

nothing should block the content by default

2. Search and filter areas must become compact and contextual
Incorrect: search/filter block taking the entire mobile viewport.

Correct behavior:

turn search/filter into:

a single “Search” button → opens modal

a filter icon → opens a sheet

a horizontal chip bar (scrollable)

an expandable “Filters” section

advanced filters belong in modals/sheets only, not inline

3. Highlight area must scale, not shrink content
On mobile:

reduce padding

slightly reduce heading sizes

if the highlight contains multiple CTAs, move secondaries into an overflow menu

ensure part of the next section is visible above the fold to avoid “banner squeeze”

4. Cards adapt spacing, not structure
On mobile:

stack cards vertically

reduce padding

avoid multi-column layouts

simplify metric groupings

5. Table behavior must be mobile-friendly
Options:

horizontal scroll with sticky header

stacked “card” table rows

only essential columns visible

expandable row details for the rest

6. Buttons + CTAs universal mobile rule
primary CTA: full-width

secondary CTA: below or in overflow (never equal priority)

never place equal-weight buttons side-by-side under 360px width

7. Visual hierarchy must remain intact across breakpoints
highlight stays first

content order must not break meaning

secondary tools stay secondary (e.g., filters never go on top permanently)

✅ Checklist
This is the practical checklist from v2.1, which reflects the new rules.

[ ] Highlight area at the top, visually distinct

[ ] Responsive, readable font sizes for all text

[ ] Info rows never scroll-x, always wrap

[ ] Primary/secondary CTAs follow mobile/desktop rules

[ ] Badges use enum-to-label mapping

[ ] Sidebar and filters adapt for mobile (modal/sheet/etc.)

[ ] No overflow or hidden content on any device

---

## 🆕 Additional Conventions (v2.3+)

### Sidebar & Drawer Behavior

- The sidebar must be togglable (show/hide) on **all screen sizes**. Users can always hide or show the sidebar, not just on mobile.
- On desktop, the sidebar is only visible when toggled open. When closed, it is fully hidden and does not reserve space.
- On mobile, the sidebar is presented as a modal drawer (Sheet) that covers the entire screen, including the header, when open.
- The sidebar toggle button is always visible for authenticated users, regardless of screen size.
- The sidebar must never show if the user is not authenticated.

### Header & Overlay

- The header must always remain above the sidebar and overlays (`z-50` or higher).
- On mobile, when the sidebar (Sheet) is open, it covers the header for a true drawer experience.
- On desktop, overlays from mobile components (Sheet, Dialog, etc.) must never appear or interfere.

### Typography in Sidebar

- Sidebar titles use `text-lg` (mobile) and `md:text-xl` (desktop).
- Sidebar subtitles use `text-sm` (mobile) and `md:text-base` (desktop).
- Avoid oversized headings or subtitles in the sidebar.

### Responsive Sidebar Implementation

- Only render the mobile Sheet/drawer when on mobile (`sm:hidden` or via JS media query).
- Only render the desktop sidebar when on desktop (`sm:flex` and above).
- Never render both at the same time.

### Overlay Handling

- Mobile overlays (Sheet, Dialog) must not render or affect desktop layouts.
- Desktop sidebar must never trigger a modal overlay.

---