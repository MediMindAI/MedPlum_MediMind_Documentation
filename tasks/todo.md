# Screenshot Pipeline Validation & State Management Improvements

## Problem Summary
Current pipeline produces **duplicate/generic screenshots** because:
1. `captureSteps` in plan JSONs are ignored - agents do basic navigate+screenshot
2. No UI state setup - multiple screenshots show identical default state
3. No validation - screenshots marked "completed" without verifying content matches description
4. No duplicate detection - same content captured under different basenames

## Todo Items

### Step 1: Update Plan JSON Schema & Remove Bad Screenshots
- [x] Remove ai-streaming-response, ai-source-references, ai-voice-input from plans
- [x] Update HTML files to remove corresponding data-i18n-img attributes
- [x] Add verificationCriteria, stateSetup, differentiator fields to remaining screenshots
- [x] Update ai-chatbot-overview.json with proper interaction sequences
- [x] Update ai-chatbot-components.json

### Step 2: Update SKILL.md Phase 4 (Capture Instructions)
- [x] Add structured execution loop that READS and EXECUTES captureSteps
- [x] Add immediate post-capture validation requirement
- [x] Add duplicate comparison against previous screenshots
- [x] Add "needs-recapture" status for failed validation

### Step 3: Update SKILL.md Phase 5 (Validation Instructions)
- [x] Add Agent C duplicate detection algorithm
- [x] Add content-to-description validation checklist per basename
- [x] Add mandatory image reading (no sampling)
- [x] Add "needs-recapture" vs "completed" decision logic

### Step 4: Add Mobile Screenshot CSS Class
- [x] Add `.doc-screenshot-mobile` CSS class to `css/parts/05-components.css`
- [x] Add optional `.doc-mobile-frame` wrapper class

### Step 5: Update HTML with Mobile Screenshot Class
- [x] Update ai-chatbot-overview.html mobile screenshot to use new class (en/ka/ru)
- [x] Mobile screenshots will display at correct size (max 375px)

### Step 6: Create Validation Criteria Documentation
- [x] Create `screenshot-plans/_validation-criteria.md` with per-basename checklist

## Updated Screenshot List

After removing test-data-dependent screenshots:

**ai-chatbot-overview.json (6 screenshots):**
1. ai-chat-interface - Full interface overview
2. ai-knowledge-base-selector - KB selection tabs
3. ai-conversation-history - Sidebar with test conversations
4. ai-document-library - Library page
5. ai-case-creation - Modal open
6. ai-mobile-chat - Mobile view

**ai-chatbot-components.json (2 screenshots):**
1. ai-welcome-screen - Welcome with quick action cards
2. ai-message-input - Input area focused

**Removed:**
- ai-streaming-response (requires live AI interaction)
- ai-source-references (requires AI response with sources)
- ai-voice-input (duplicate of welcome screen - voice button visible in ai-message-input)

**Total: 8 basenames × 3 languages = 24 PNG files**

## Review

### Summary
Implemented screenshot pipeline validation and state management improvements:

1. **Removed 3 problematic screenshots** that require test data or live interaction:
   - ai-streaming-response, ai-source-references, ai-voice-input
   - Updated all HTML files (en/ka/ru) to remove their data-i18n-img attributes
   - Updated plan JSONs and _index.json with new counts

2. **Enhanced plan JSON schema** with new fields:
   - `verificationCriteria.mustShow` - Required visual elements
   - `verificationCriteria.mustNotShow` - Forbidden elements
   - `stateSetup.preconditions` - Requirements before capture
   - `stateSetup.interactionSequence` - Steps to reach unique UI state
   - `differentiator` - What makes this screenshot unique

3. **Updated SKILL.md Phase 4** with:
   - verificationCriteria check after each capture
   - Preliminary duplicate detection during capture
   - "needs-recapture" status for failed validation

4. **Updated SKILL.md Phase 5** with:
   - AI Chatbot per-basename validation checklist
   - Detailed duplicate detection algorithm
   - verificationCriteria E-step in Agent C validation

5. **Added mobile screenshot CSS**:
   - `.doc-screenshot-mobile` class (max-width: 375px)
   - `.doc-mobile-frame` wrapper class with device frame styling
   - Applied to ai-mobile-chat screenshots in all 3 languages

6. **Created validation criteria documentation**:
   - `screenshot-plans/_validation-criteria.md`
   - Per-basename checklist with mustShow/mustNotShow
   - Duplicate detection guide with high-risk pairs

### Files Modified
- `screenshot-plans/ai-chatbot-overview.json` - Updated schema, removed 2 screenshots
- `screenshot-plans/ai-chatbot-components.json` - Updated schema, removed 1 screenshot
- `screenshot-plans/_index.json` - Updated counts (8 basenames, 24 files)
- `sections/en/ai-chatbot-overview.html` - Removed 2 screenshot refs, added mobile class
- `sections/ka/ai-chatbot-overview.html` - Same changes
- `sections/ru/ai-chatbot-overview.html` - Same changes
- `sections/en/ai-chatbot-components.html` - Removed 1 screenshot ref
- `sections/ka/ai-chatbot-components.html` - Same change
- `sections/ru/ai-chatbot-components.html` - Same change
- `.claude/skills/doc-pipeline/SKILL.md` - Enhanced Phase 4 & 5 validation
- `css/parts/05-components.css` - Added mobile screenshot classes

### Files Created
- `screenshot-plans/_validation-criteria.md` - Per-basename validation rules

### Next Steps
1. Delete the old PNG files for removed screenshots (ai-streaming-response-*, ai-source-references-*, ai-voice-input-*)
2. Re-run the capture pipeline to capture new screenshots with proper validation
3. Verify the new screenshots show distinct UI states per the differentiator fields
