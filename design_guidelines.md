# AI Mentor - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from ChatGPT, Linear, and Notion for their clean, conversation-focused interfaces with minimal distraction.

**Core Principle**: Minimalist aesthetic with purposeful micro-interactions that enhance the mentoring experience.

---

## Typography

**Font Families**:
- Primary: Inter (via Google Fonts CDN)
- Monospace: JetBrains Mono (for any code snippets in responses)

**Hierarchy**:
- Page Title/Logo: 2xl-3xl, font-semibold
- User Questions: base-lg, font-normal
- AI Responses: base, font-normal, leading-relaxed for readability
- Input Placeholder: base, font-normal, text-gray-400
- Button Text: sm-base, font-medium

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, and 16 for consistent rhythm
- Component padding: p-4 to p-8
- Message spacing: space-y-6
- Section gaps: gap-4 to gap-8

**Container Strategy**:
- Main container: max-w-3xl mx-auto (optimal reading width for chat)
- Full viewport height: min-h-screen with flex column layout
- Chat area: flex-1 to fill available space
- Input area: Fixed at bottom with subtle elevation

---

## Component Library

### Header/Branding
- Fixed top bar with "AI Mentor" branding
- Height: h-16
- Include subtle tagline: "Your Intelligent Learning Companion"
- Clean separator line at bottom

### Chat Interface Container
- Centered conversation area (max-w-3xl)
- Scrollable message history with smooth scroll behavior
- Messages aligned: User messages right-aligned, AI responses left-aligned
- Ample padding around messages (p-6 to p-8)

### Message Bubbles
**User Messages**:
- Right-aligned with rounded corners (rounded-2xl)
- Padding: px-6 py-4
- Subtle shadow for depth
- Max width: 75% of container

**AI Mentor Responses**:
- Left-aligned with generous spacing
- No bubble background - feels more like published content
- Avatar icon: Small circle with "AM" initials or simple AI icon (use Heroicons)
- Include subtle typing indicator animation during loading

### Input Area
**Design**:
- Fixed bottom position with backdrop blur effect
- Large, prominent textarea (min-h-14, grows to max-h-32)
- Rounded corners (rounded-2xl)
- Border with subtle focus state (no harsh outlines)
- Send button: Icon-only (Heroicons paper airplane), positioned bottom-right of input
- Padding: p-4 within input container, px-6 py-4 for outer container

### Loading States
- Elegant three-dot typing animation while waiting for response
- Positioned where AI response will appear
- Subtle bounce animation on dots

### Empty State
- Display when no conversation exists
- Centered welcome message: "Hello! I'm your AI Mentor. Ask me anything."
- 3-4 example questions as clickable suggestion chips
- Suggestion chips: rounded-full, px-4 py-2, hover state with slight scale

---

## Animations & Interactions

**Message Send**:
- User message: Slide in from right with fade (duration-300)
- Scroll to bottom smooth behavior after message send

**Response Appearance**:
- AI response: Fade in from slight upward position (duration-500)
- Typing indicator appears immediately, replaced by actual response

**Input Focus**:
- Subtle border color transition (duration-200)
- No dramatic transforms

**Button Interactions**:
- Send button: Scale slightly on hover (scale-105)
- Suggestion chips: Subtle background transition on hover

---

## Images

**No Hero Image**: This is a chat-focused utility application. The interface opens directly to the conversation area with minimal chrome.

**Avatar/Branding**:
- Small AI Mentor icon/avatar next to responses (24x24 or 32x32)
- Use abstract geometric icon or simple "AM" text in circle

---

## Accessibility

- Proper focus indicators on input and buttons
- Semantic HTML for messages (article/section tags)
- ARIA labels for icon-only buttons
- Keyboard navigation: Enter to send, Shift+Enter for new line in input
- Sufficient contrast ratios for all text

---

## Mobile Responsiveness

- Input area: Full width with comfortable touch targets (min-h-12)
- Messages: Stack naturally with 90% max-width on mobile
- Header: Remains fixed with responsive text sizing
- Bottom padding to account for mobile keyboards
- Suggestion chips: Horizontal scroll on mobile

---

## Key Differentiators

1. **No document references**: All responses framed as AI Mentor's knowledge
2. **Conversation continuity**: Session management maintains context visually
3. **Minimalist focus**: Remove all unnecessary UI chrome, let conversation breathe
4. **Purposeful space**: Generous whitespace makes content digestible
5. **Subtle intelligence**: Micro-interactions feel responsive without being gimmicky

The design creates a focused, distraction-free environment where users feel they're having a meaningful conversation with an intelligent mentor, not querying a database.