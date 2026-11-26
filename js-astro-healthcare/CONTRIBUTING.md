# Contributing to Healthcare Astro Theme

Thank you for your interest in contributing to Healthcare Astro Theme! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Celebrate contributions of all kinds

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Your environment (OS, Node version, browser)
- Screenshots if applicable

### Suggesting Features

Feature suggestions are welcome! Please open an issue with:
- A clear description of the feature
- Use cases and examples
- Why this would be valuable to the theme

### Pull Requests

1. **Fork the repository**
2. **Create a branch** from `main` or `master`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following the project's code style
4. **Test your changes**:
   ```bash
   npm test
   ```
5. **Commit your changes** with clear messages:
   ```bash
   git commit -m "Add: description of your change"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** with a clear description

## Development Setup

```bash
# Clone your fork
git clone https://github.com/web-stacked/healthcare-astro-theme.git
cd healthcare-astro-theme

# Install the exact locked dependencies
npm ci

# Start development server
npm run dev

# Build for production
npm run build
```

## Code Style Guidelines

### Astro Components
- Use TypeScript for type safety
- Follow the existing component structure
- Use semantic HTML
- Include proper ARIA labels for accessibility
- Keep components focused and reusable

### Styling
- Use Tailwind CSS utility classes
- Follow the design system tokens (use `theme-*` classes)
- Maintain responsive design (mobile-first)
- Use the `section` and `section-sm` utilities for spacing

### File Naming
- Components: `PascalCase.astro` (e.g., `Button.astro`)
- Pages: `kebab-case.astro` (e.g., `about-us.astro`)
- Data files: `kebab-case.json` (e.g., `navigation.json`)

### Commit Messages

Use clear, descriptive commit messages:
- `Add:` for new features
- `Fix:` for bug fixes
- `Update:` for improvements
- `Refactor:` for code restructuring
- `Docs:` for documentation changes
- `Style:` for formatting/styling

Examples:
```
Add: dark mode toggle component
Fix: button hover state on mobile
Update: improve heading component accessibility
Docs: add component usage examples
```

## Component Guidelines

### Creating New Components

1. **Location**: Place in `/src/components/`
2. **Props**: Use TypeScript interfaces
3. **Documentation**: Add JSDoc comments for complex props
4. **Accessibility**: Include ARIA labels and semantic HTML
5. **Responsive**: Ensure mobile-first responsive design

Example:
```astro
---
interface Props {
  title: string;
  description?: string;
  variant?: 'primary' | 'secondary';
}

const { title, description, variant = 'primary' } = Astro.props;
---

<div class={`component component-${variant}`}>
  <h2>{title}</h2>
  {description && <p>{description}</p>}
</div>
```

### Updating Existing Components

- Maintain backward compatibility when possible
- Update TypeScript types if adding props
- Update documentation (README.md, CUSTOMIZATION.md)
- Test across different use cases

## Design System

### Colors
- Use theme color tokens (`bg-theme-primary`, `text-theme-text-primary`)
- Don't hardcode colors unless absolutely necessary
- Maintain consistency with existing palette

### Typography
- Use the `Heading` component for headings
- Follow the typography scale defined in `tailwind.css`
- Ensure proper heading hierarchy (h1 → h2 → h3)

### Spacing
- Use `section` and `section-sm` utilities for vertical spacing
- Use Tailwind spacing scale for component-level spacing
- Maintain consistent spacing patterns

## Testing

Before submitting a PR:
- [ ] Run all automated checks (`npm test`)
- [ ] Test in development mode (`npm run dev`)
- [ ] Test on multiple screen sizes
- [ ] Check accessibility (keyboard navigation, screen readers)
- [ ] Verify no console errors
- [ ] Test in multiple browsers (Chrome, Firefox, Safari)

## Documentation

When adding features:
- Update `README.md` if adding major features
- Update `CUSTOMIZATION.md` if adding customization options
- Add code examples in documentation
- Update `CHANGELOG.md` with your changes

## Questions?

- Open an issue for questions
- Check existing issues and PRs
- Review the [Astro documentation](https://docs.astro.build)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
