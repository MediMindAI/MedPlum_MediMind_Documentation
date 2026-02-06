# Screenshot Validation Criteria

This document defines the validation rules for each screenshot basename. Use during Phase 4 (CAPTURE) and Phase 5 (VERIFY) to ensure screenshots show the correct content.

## Validation Status Model

| Status | Meaning |
|--------|---------|
| `pending` | File does not exist on disk |
| `captured` | File exists but NOT validated yet |
| `completed` | File exists AND passed all validation checks |
| `needs-recapture` | File exists but FAILED validation |
| `failed` | Capture was attempted but failed |

## AI Chatbot Screenshots

### ai-chat-interface
**Description:** Full AI chat interface with sidebar, message area, and input
**Route:** `/emr/ai-assistant/chat`
**Viewport:** 1440x900

**mustShow:**
- Chat header with KB selector tabs
- Welcome screen or message area in center
- Input area at bottom with text field
- Sidebar on left (may be collapsed on mobile)

**mustNotShow:**
- Login page
- Error page
- Blank screen

**Differentiator:** Full-page overview showing entire layout

---

### ai-knowledge-base-selector
**Description:** Knowledge base tabs showing Medical Knowledge and My Documents options
**Route:** `/emr/ai-assistant/chat`
**Viewport:** 1440x900

**mustShow:**
- KB tab area visible in header
- "Medical Knowledge" tab/option
- "My Documents" or "Personal" tab/option
- One tab appears selected/highlighted

**mustNotShow:**
- Login page
- Dropdown menu obscuring main content

**Differentiator:** KB tabs with visible selection indicator

---

### ai-conversation-history
**Description:** Conversation history sidebar showing list of past chats
**Route:** `/emr/ai-assistant/chat`
**Viewport:** 1440x900

**mustShow:**
- Sidebar visible on left side
- Conversation list area (may show empty state if no conversations)
- New chat button

**mustNotShow:**
- Sidebar collapsed/hidden
- Login page

**Differentiator:** Sidebar with history list prominently visible

---

### ai-document-library
**Description:** Document library page with uploaded documents grid
**Route:** `/emr/ai-assistant/library`
**Viewport:** 1440x900

**mustShow:**
- Document library header/title
- Upload area or document grid
- Category tabs/filters

**mustNotShow:**
- Chat interface as main content
- Login page

**Differentiator:** Different route (/library instead of /chat)

---

### ai-case-creation
**Description:** Case creation modal with Manual Entry and From Patient tabs
**Route:** `/emr/ai-assistant/cases`
**Viewport:** 1440x900

**mustShow:**
- Modal overlay visible
- "Manual Entry" tab
- "From Patient" tab
- Form fields for case creation

**mustNotShow:**
- Modal closed/not visible
- Only case list without modal

**Differentiator:** Modal open with both tabs visible

---

### ai-mobile-chat
**Description:** Mobile responsive view of chat interface
**Route:** `/emr/ai-assistant/chat`
**Viewport:** 375x812 (mobile)

**mustShow:**
- Narrow mobile layout
- Chat area visible
- Input at bottom

**mustNotShow:**
- Desktop sidebar expanded
- 1440px wide layout

**Differentiator:** Mobile viewport (375px width)

**Special Notes:**
- Switch language BEFORE resizing to mobile viewport
- Mobile viewport hides language buttons
- Use `.doc-screenshot-mobile` CSS class for display

---

### ai-welcome-screen
**Description:** Welcome screen with quick action cards
**Route:** `/emr/ai-assistant/chat`
**Viewport:** 1440x900

**mustShow:**
- Welcome message or greeting text
- Quick action cards (Quick Consult, New Case, etc.)
- Action buttons for starting conversations

**mustNotShow:**
- Active conversation with messages
- Login page

**Differentiator:** Welcome state with prominent action cards

---

### ai-message-input
**Description:** Message input area with voice and attachment buttons
**Route:** `/emr/ai-assistant/chat`
**Viewport:** 1440x900

**mustShow:**
- Text input field
- Voice/microphone button
- Attachment/paperclip button
- Send button

**mustNotShow:**
- Login page
- Error state

**Differentiator:** Input area with all buttons visible

---

## Duplicate Detection Guide

### High-Risk Duplicate Pairs

These basenames often look similar and require careful differentiation:

1. **ai-welcome-screen ≈ ai-message-input**
   - Both show the chat page in default state
   - Differentiate by: Welcome screen has prominent action cards; message-input focuses on the input area

2. **ai-chat-interface ≈ ai-conversation-history**
   - Both show the full page layout
   - Differentiate by: conversation-history should emphasize the sidebar with history list

3. **ai-chat-interface ≈ ai-welcome-screen**
   - Both show the default chat state
   - Differentiate by: chat-interface is a full overview; welcome-screen focuses on the welcome message/cards

### Different Routes (Low Duplicate Risk)

These screenshots are on different routes and should look distinct:
- ai-document-library → /emr/ai-assistant/library
- ai-case-creation → /emr/ai-assistant/cases (with modal open)
- ai-mobile-chat → /emr/ai-assistant/chat at 375px viewport

---

## Removed Screenshots

The following basenames were removed from the plan because they require test data or live interaction that cannot be reliably automated:

| Basename | Reason |
|----------|--------|
| ai-streaming-response | Requires live AI interaction to show streaming text |
| ai-source-references | Requires AI response with source citations |
| ai-voice-input | Duplicate of welcome screen; voice popover requires user interaction |

These screenshots should NOT be in the plan JSON or referenced in HTML files.
