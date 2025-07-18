# Feature: About Screen

## Description
This feature introduces an "About" screen to the application, providing users with information about the application, its purpose, and potentially version details or credits. The screen will be accessible via a new navigation option.

## Internationalization (i18n)
The content of the About screen will be fully internationalized, supporting at least English (en) and Portuguese (pt) languages. All text displayed on this screen will be managed through the i18n system.

## Navigation Changes: Hamburger Menu
To accommodate new navigation options and improve user experience on various screen sizes, the existing navigation bar will be replaced with a hamburger menu.

### Accessing the About Screen
The About screen will be accessible by:
1. Clicking on the hamburger menu icon (typically located in the top-left or top-right corner of the header).
2. Selecting the "About" (or localized equivalent) option from the expanded menu.

## Technical Details
- A new React component `AboutPage.js` will be created under `frontend/src/pages/`.
- New translation keys will be added to `frontend/src/locales/en/translation.json` and `frontend/src/locales/pt/translation.json` for the About screen content.
- The `Navbar.js` component will be refactored to implement a responsive hamburger menu, managing its open/closed state.
- A new route will be added to `frontend/src/App.js` to render the `AboutPage` component.
