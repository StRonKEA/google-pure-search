# Verification report — 2026-09-21

Tested userscript: Google Clean Search 8.0.1, including the .MjjYud card fallback.

## Live Google comparisons

The complete userscript was evaluated through the supported browser CDP interface after each page loaded. Before/after checks compared retained DOM nodes, link attributes and element visibility. These were not userscript-manager installation tests.

| Query | Observed result |
| --- | --- |
| python nedir | 3210 original elements; 0 removed nodes, 0 changed link addresses, 0 newly hidden elements outside targeted wrappers. Eight organic result headings remained visible. |
| başlangıç | 3148 original elements; 0 removed nodes, 0 changed link addresses. Only the AI Mode link and its descendants became hidden. Film card remained visible and retained its 20 image elements. Image count does not establish that every image was visible. |
| White Collar | Translated Wikipedia title changed from visible to hidden; original English title changed from hidden to visible. 0 removed nodes, 0 changed link addresses, 0 newly hidden elements outside targeted wrappers. |

## Controlled browser tests

79 assertions passed, 0 failed across five fixtures: base, German source language, missing original, ambiguous original, dynamically inserted result. Checks include normal navigation/cards/sidebar, retention of original elements, translation stability after style and link updates, manual translation links, nested AI answers, idle loops, and 1000 added ordinary elements per fixture.

Measured initialization: approximately 0.1–0.3 ms. Maximum observed observer callback: approximately 0.1 ms. Maximum deferred animation-frame callback: approximately 0.2 ms. These are JavaScript callback timings in the controlled fixtures, not total page loading, rendering, INP, or memory benchmarks. Zero timings reflect timer resolution, not zero work.

No synthetic translation clicks or idle observer loops were observed. Unrelated text updates did not trigger document-wide querySelectorAll calls. This check alone does not count every possible subtree query.

## Limits

- No guarantee across all Google layouts, languages, accounts or future changes.
- Live tests injected the entire file after page load; document-start timing and Tampermonkey/Violentmonkey integration were not validated.
- A single subtree scan may exceed the nominal 6 ms yielding threshold because elapsed time is checked after that scan.
- Hiding an AI response inside a question can leave a question with less or no answer content; the question itself is retained.
- The script hides interface elements; it does not block Google AI network requests or server-side generation.
- Missing or ambiguous original title/snippet pairs remain untouched with Google controls available.
- Tests establish node/link/visibility behavior for these cases, not exhaustive interaction-flow or pixel-layout equivalence.
