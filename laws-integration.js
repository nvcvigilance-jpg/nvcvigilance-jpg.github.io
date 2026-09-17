/**
 * laws-integration.js
 *
 * Patches nvcGetLocalSuggestedLaws to use NVC.LawsDB.find() from
 * nepal-laws-db-catalog.js (laws_database.json catalog) with full
 * section text (दफा/धारा) and proper section number display.
 *
 * Loaded AFTER nepal-laws-db-catalog.js and script.js.
 */
(function () {
    'use strict';

    // Store original function
    var _origGetLocalSuggestedLaws =
        typeof nvcGetLocalSuggestedLaws === 'function' ? nvcGetLocalSuggestedLaws : null;

    /**
     * Enhanced nvcGetLocalSuggestedLaws:
     *  1. Try NVC.LawsDB.find() from the 245-law catalog
     *  2. Include full section text for matched sections
     *  3. Fallback to existing NVC.Laws / LAWS_AND_REGULATIONS path
     */
    window.nvcGetLocalSuggestedLaws = function (description, limit) {
        limit = limit || 5;
        var text = String(description || '');
        var dbLaws = [];

        // ── LawsDB catalog path (primary) ─────────────────────────────
        if (window.NVC && NVC.LawsDB && typeof NVC.LawsDB.find === 'function') {
            try {
                var results = NVC.LawsDB.find(text, limit);
                if (results && results.length > 0) {
                    results.forEach(function (r) {
                        var matchedSections = r.sections || [];
                        var secLabel = '';
                        var secHtml = '';
                        var descParts = [];
                        var lawName = r.lawName || '';

                        // Determine if this is a नियमावली (regulation) or ऐन (act)
                        var isRegulation = lawName.indexOf('\u0928\u093F\u092F\u092E\u093E\u0935\u0932\u0940') !== -1;
                        var sectionWord = isRegulation ? '\u0928\u093F\u092F\u092E' : '\u0926\u092B\u093E';
                        var lawType = isRegulation ? '\u0928\u093F\u092F\u092E\u093E\u0935\u0932\u0940' : '\u0910\u0928';
                        var verb = '\u0938\u0901\u0917 \u0938\u092E\u094D\u092C\u0928\u094D\u0927\u093F\u0924';

                        if (matchedSections.length > 0) {
                            // Build section label with numbers/titles
                            secLabel = matchedSections
                                .slice(0, 3)
                                .map(function (s) { return sectionWord + ' ' + s.n + ' (' + s.t + ')'; })
                                .join('; ');

                            // Build detailed section HTML
                            matchedSections.slice(0, 3).forEach(function (s) {
                                var secNum = s.n || '';
                                var secTitle = s.t || '';
                                var secContent = s.c || '';
                                var contentPreview = secContent.length > 300
                                    ? secContent.substring(0, 300) + '...'
                                    : secContent;

                                secHtml += '<div class="law-section-item" style="margin-bottom:6px;padding:5px 8px;background:#fff8f8;border:1px solid #fce4e4;border-radius:5px;">';

                                // ▶ यो ऐनको दफा १ (संक्षिप्त नाम) सँग सम्बन्धित
                                // OR: यो नियमावलीको नियम १ (संक्षिप्त नाम) सँग सम्बन्धित
                                secHtml += '<div style="font-weight:700;font-size:0.82rem;color:#b71c1c;">';
                                secHtml += '\u25B6 \u092F\u094B ' + lawType + '\u0915\u094B ' + sectionWord + ' ' + secNum + ' (' + secTitle + ') ' + verb;
                                secHtml += '</div>';

                                if (contentPreview) {
                                    secHtml += '<div style="font-size:0.78rem;line-height:1.4;color:#444;margin-top:3px;padding-left:8px;border-left:2px solid #ef9a9a;white-space:pre-wrap;">' + contentPreview + '</div>';
                                }
                                secHtml += '</div>';
                            });
                        }

                        if (r.theme) descParts.push(r.theme);
                        if (secLabel) descParts.push(secLabel);

                        dbLaws.push({
                            name: lawName,
                            score: r.relevance || 1,
                            description: descParts.join(' — '),
                            section: secLabel,
                            sectionHtml: secHtml,
                            sectionContent: secHtml,
                            theme: r.theme || '',
                            sections: matchedSections,
                            matchedKeywords: r.matchedKeywords || []
                        });
                    });
                    return dbLaws;
                }
            } catch (e) {
                console.warn('LawsDB.find error:', e);
            }
        }

        // ── Fallback: original function ────────────────────────────────
        if (_origGetLocalSuggestedLaws) {
            var legacy = _origGetLocalSuggestedLaws(description, limit);
            if (legacy && legacy.length > 0) {
                return legacy.map(function (l) {
                    return {
                        name: l.name || '',
                        score: l.score || 1,
                        description: l.description || '',
                        section: '',
                        sectionHtml: '',
                        sectionContent: '',
                        theme: '',
                        sections: []
                    };
                });
            }
        }

        // ── Last resort: empty ─────────────────────────────────────────
        return [];
    };

    // Patch nvcMergeSuggestedLaws to handle new format
    var _origMerge = typeof nvcMergeSuggestedLaws === 'function' ? nvcMergeSuggestedLaws : null;
    window.nvcMergeSuggestedLaws = function (aiLaws, localLaws, limit) {
        if (_origMerge) return _origMerge(aiLaws, localLaws, limit);

        limit = limit || 5;
        var out = [];
        var seen = {};
        function push(item) {
            if (!item || !item.name) return;
            var key = String(item.name).trim();
            if (!key || seen[key]) return;
            seen[key] = true;
            out.push({
                name: key,
                description: item.description || '',
                section: item.section || '',
                sectionHtml: item.sectionHtml || item.sectionContent || '',
                sections: item.sections || []
            });
        }
        (Array.isArray(aiLaws) ? aiLaws : []).forEach(push);
        (Array.isArray(localLaws) ? localLaws : []).forEach(push);
        return out.slice(0, limit);
    };

    console.log('✅ laws-integration.js loaded — NVC.LawsDB integration with section text active');
})();