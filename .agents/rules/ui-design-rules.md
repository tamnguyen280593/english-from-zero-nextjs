# UI Design Rules

When developing or modifying the UI for this project, agents must strictly adhere to the following design guidelines:

## 1. Typography & Readability
- Ensure font sizes are responsive and avoid text wrapping on small viewports where it breaks the layout.
- Maintain strong contrast between text and background. Labels on top of images must use white text with a dark `text-shadow` or background overlay for maximum readability.

## 2. Component Architecture
- Use `CategoryCard` for grouping high-level categories (e.g., Textbook vs. Communication).
- Use `TopicCard` for individual subject topics.
- Keep badges prominent and aligned properly using predefined `Badge` component classes.

## 3. Aesthetics
- Use modern, flat illustrations without baked-in text to allow localization and dynamic text overlays.
- Maintain the predefined color palette for levels (e.g., starter, beginner, intermediate).
