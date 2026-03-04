# Changelog — Final_Version1.2.0 fixes

Date: 2026-03-04

Summary:
- Fixed unwanted small page slide/scroll when clicking sidebar navigation items (ड्यासबोर्ड, उजुरीहरु).
- Fixed search input caret (cursor) disappearing while typing in the complaints filter.
- Prevented default behavior of anchors using `href="#"` to avoid browser jump.
- Reduced content reflow by suppressing vertical translate animation during frequent filter updates.

Files changed:
- `script.js` — added caret-preserve logic, restored focus after re-render, global anchor click prevention, support flag `state._suppressContentTransition`, and small render-flow tweaks.
- `style.css` — removed `translateY` from `.content-area.is-transitioning` to avoid slide effect.

Testing / Verification steps:
1. Open `index.html` in a browser and login as a branch (शाखा) user.
2. Click sidebar items: `ड्यासबोर्ड` and `उजुरीहरू` — the page should not perform a small downward slide; transitions remain smooth.
3. On `उजुरीहरू`, focus the `खोज्नुहोस्...` input and type characters — the caret should not disappear and selection should persist.
4. Click the `खोज्नुहोस्` button — page should not jump/scroll unexpectedly.
5. Check other modals and interactive elements for normal focus behavior.

Notes & rationale:
- The issue was likely caused by a combination of frequent full-content re-renders combined with a translateY transition on the content container, and anchors with `href="#"` triggering browser default jumps. Addressed by:
  - Preserving and restoring input selection across renders.
  - Temporarily suppressing the translate transition during filter-triggered re-renders.
  - Preventing default navigation for `href="#"` anchors globally.

Suggested commit message:
"fix(ui): prevent content jump on nav/search — preserve search caret, suppress slide transition, prevent # anchor navigation"

Suggested git commands:
```bash
git add script.js style.css CHANGELOG.md
git commit -m "fix(ui): prevent content jump on nav/search — preserve search caret, suppress slide transition, prevent # anchor navigation"
```

If you want, I can make this commit for you (need permission), or add diagnostic logs instead if any remaining glitches persist.
