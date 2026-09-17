/**
 * laws-display-patch.js
 *
 * Directly queries NVC.LawsDB.find() and renders the result with
 * full दफा/नियम section numbers and text. Bypasses the old
 * nepal-laws-catalog.js suggestFromComplaint pipeline.
 *
 * Loaded AFTER nepal-laws-db-catalog.js and script.js.
 */
(function () {
    'use strict';

    /**
     * Direct display of laws with section numbers from LawsDB.
     * Called directly from the complaint description input event.
     */
    function renderLawsFromLawsDB(text) {
        var container = document.getElementById('aiSuggestedLaws');
        if (!container) return;

        // Try LawsDB
        var laws = [];
        if (window.NVC && NVC.LawsDB && typeof NVC.LawsDB.find === 'function') {
            try {
                laws = NVC.LawsDB.find(text, 5);
            } catch (e) {
                console.warn('LawsDB.find failed:', e);
            }
        }

        if (!laws || laws.length === 0) {
            container.innerHTML = '<div class="text-muted small p-1">\u0915\u0941\u0928\u0948 \u0915\u093E\u0928\u0942\u0928 \u092B\u0947\u0932\u093E \u092A\u0930\u0947\u0928</div>';
            return;
        }

        var html = '<div class="nvc-ai-laws-inner">';
        html += '<strong class="d-block mb-1 text-primary small"><i class="fas fa-balance-scale"></i> \u0938\u092E\u094D\u092C\u0928\u094D\u0927\u093F\u0924 \u0910\u0928/\u0915\u093E\u0928\u0942\u0928\u0915\u093E \u092A\u094D\u0930\u093E\u0935\u0927\u093E\u0928\u0939\u0930\u0942 (\u0926\u092B\u093E/\u0928\u093F\u092F\u092E):</strong>';
        html += '<div class="nvc-ai-laws-list" style="max-height:300px;overflow-y:auto;">';

        laws.forEach(function (r, idx) {
            var lawName = r.lawName || '';
            var relevance = r.relevance || 0;
            var sections = r.sections || [];

            var isReg = lawName.indexOf('\u0928\u093F\u092F\u092E\u093E\u0935\u0932\u0940') !== -1;
            var sWord = isReg ? '\u0928\u093F\u092F\u092E' : '\u0926\u092B\u093E';
            var lType = isReg ? '\u0928\u093F\u092F\u092E\u093E\u0935\u0932\u0940' : '\u0910\u0928';

            // Law name header
            html += '<div class="mb-2 pb-1" style="border-bottom:1px solid #e0e0e0;">';
            html += '<div class="fw-bold" style="font-size:0.85rem;color:#1565c0;">';
            html += (idx + 1) + '. ' + lawName;
            if (relevance > 0) {
                html += ' <span class="badge bg-warning text-dark" style="font-size:0.65rem;">' + Math.round(relevance * 100) + '%</span>';
            }
            html += '</div>';

            if (sections.length === 0) {
                html += '<div class="text-muted small" style="font-size:0.78rem;">\u0938\u092E\u094D\u092C\u0928\u094D\u0927\u093F\u0924 \u092A\u094D\u0930\u093E\u0935\u0927\u093E\u0928</div>';
            } else {
                sections.forEach(function (s) {
                    var secNum = s.n || '';
                    var secTitle = s.t || '';
                    var secContent = s.c || '';
                    var contentPreview = secContent.length > 300
                        ? secContent.substring(0, 300) + '...'
                        : secContent;

                    html += '<div class="law-section-item" style="margin-top:4px;margin-bottom:6px;padding:4px 6px;background:#fff5f5;border:1px solid #fdd;border-radius:4px;">';
                    // ▶ यो ऐनको दफा {n} ({t}) सँग सम्बन्धित
                    html += '<div style="font-weight:700;font-size:0.82rem;color:#b71c1c;">';
                    html += '\u25B6 \u092F\u094B ' + lType + '\u0915\u094B ' + sWord + ' ' + secNum + ' (' + secTitle + ') \u0938\u0901\u0917 \u0938\u092E\u094D\u092C\u0928\u094D\u0927\u093F\u0924';
                    html += '</div>';
                    if (contentPreview) {
                        html += '<div style="font-size:0.78rem;line-height:1.35;color:#333;margin-top:2px;padding-left:6px;border-left:2px solid #ef9a9a;white-space:pre-wrap;">' + contentPreview + '</div>';
                    }
                    html += '</div>';
                });
            }

            html += '</div>';
        });

        html += '</div></div>';
        container.innerHTML = html;
    }

    /**
     * Attach to the complaintDescription input event.
     * This is the main entry point: intercepts the text input and renders
     * LawsDB results with section details directly.
     */
    function attachToInput() {
        var descField = document.getElementById('complaintDescription');
        if (!descField) {
            // Retry later if form isn't loaded yet
            setTimeout(attachToInput, 500);
            return;
        }

        // Remove any existing listeners to avoid duplicates
        var oldHandler = descField._lawsDbHandler;
        if (oldHandler) {
            descField.removeEventListener('input', oldHandler);
        }

        var handler = function () {
            var text = this.value || '';
            var aiContent = document.getElementById('aiSuggestionContent');
            var lawsContainer = document.getElementById('aiSuggestedLaws');

            if (!lawsContainer || !aiContent) return;

            if (text.length >= 5) {
                aiContent.classList.remove('hidden');
                renderLawsFromLawsDB(text);
            } else {
                // Clear if too short
                if (lawsContainer) lawsContainer.innerHTML = '';
            }
        };
        descField._lawsDbHandler = handler;
        descField.addEventListener('input', handler);

        // Also handle similar for edit forms
        var editDesc = document.getElementById('editDescription');
        if (editDesc && !editDesc._lawsDbHandler) {
            var editHandler = function () {
                var text = this.value || '';
                if (text.length >= 5) renderLawsFromLawsDB(text);
            };
            editDesc._lawsDbHandler = editHandler;
            editDesc.addEventListener('input', editHandler);
        }

        console.log('✅ laws-display-patch.js: attached to complaintDescription input');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachToInput);
    } else {
        attachToInput();
    }

    // Also watch for dynamically loaded forms (e.g., shakha login renders form later)
    var observer = new MutationObserver(function () {
        var descField = document.getElementById('complaintDescription');
        if (descField && !descField._lawsDbHandler) {
            attachToInput();
        }
    });
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });

    // Also override updateAIUI if it exists (prevents script.js from overwriting our content)
    if (typeof window.updateAIUI === 'function') {
        var _origUpdateUI = window.updateAIUI;
        window.updateAIUI = function (analysis, isAsync) {
            // Call original for other UI elements (category, priority, decision)
            try { _origUpdateUI(analysis, isAsync); } catch (e) { }
            // Override the laws section with our rich display from LawsDB
            var text = '';
            var descField = document.getElementById('complaintDescription');
            if (descField) text = descField.value;
            if (text && text.length >= 5) {
                renderLawsFromLawsDB(text);
            }
        };
    }

    console.log('✅ laws-display-patch.js loaded — direct LawsDB query with \u0926\u092B\u093E/\u0928\u093F\u092F\u092E display');
})();
