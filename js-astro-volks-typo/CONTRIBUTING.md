# Contributing to Volks-Typo

Thank you for your interest in contributing to Volks-Typo! This minimalist Astro blog theme follows Bauhaus design principles, and we welcome contributions that align with our design philosophy.

## 🎨 Design Philosophy

Before contributing, please understand our core principles:
- **Minimalism**: Less is more - avoid adding unnecessary complexity
- **Typography First**: Bold, industrial typography is our signature
- **Performance**: Zero JavaScript, minimal CSS
- **Accessibility**: All contributions must maintain WCAG 2.1 AA compliance

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/volks-typo.git
   cd volks-typo
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

### Project Structure
```
volks-typo/
├── src/
│   ├── components/     # Astro components
│   ├── content/        # Blog posts and content
│   ├── pages/          # Page routes
│   ├── styles/         # Global styles
│   └── config.ts       # Theme configuration
├── public/             # Static assets
└── astro.config.mjs    # Astro configuration
```

## 📝 How to Contribute

### Reporting Bugs
- Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- Include steps to reproduce
- Provide screenshots if relevant
- Check existing issues first

### Suggesting Features
- Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
- Explain how it aligns with our minimalist philosophy
- Consider performance implications
- Provide mockups if possible

### Submitting Pull Requests

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style
   - Add/update tests if applicable
   - Update documentation

3. **Test thoroughly**
   ```bash
   # Run linting
   npm run lint
   
   # Run type checking
   npm run check
   
   # Build and preview
   npm run build
   npm run preview
   ```

4. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve issue with mobile menu"
   git commit -m "docs: update README"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 💻 Development Guidelines

### Code Style
- Use 2 spaces for indentation
- Follow ESLint configuration
- Keep components small and focused
- Prefer CSS over JavaScript solutions

### CSS Guidelines
- Use CSS custom properties for theming
- Follow the 8-point grid system
- Maintain the existing color palette
- Use scoped styles in Astro components

### Typography Rules
- Headings: Uppercase with letter-spacing
- Body: Work Sans for readability
- Code: JetBrains Mono
- Don't add new fonts without discussion

### Performance Standards
- No JavaScript unless absolutely necessary
- Optimize images (WebP preferred)
- Keep CSS bundle under 25KB
- Test on slow connections

### Accessibility Requirements
- Semantic HTML
- Proper heading hierarchy
- ARIA labels where needed
- Keyboard navigation support
- Color contrast ratios (WCAG AA)

## 🌟 Good First Issues

Look for issues labeled `good first issue` for beginner-friendly tasks:
- Documentation improvements
- CSS optimizations
- Accessibility enhancements
- Bug fixes

## 🔍 Code Review Process

1. **Automated checks** must pass
2. **Design review** for UI changes
3. **Performance impact** assessment
4. **Accessibility testing** required
5. **Maintainer approval** needed

## 📚 Resources

### Astro Documentation
- [Astro Docs](https://docs.astro.build)
- [Astro Discord](https://astro.build/chat)

### Design References
- [Bauhaus Design Principles](https://www.bauhaus100.com/the-bauhaus/principles/)
- [Typography Best Practices](https://www.smashingmagazine.com/typography-guidelines-and-references/)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance testing
- [WAVE](https://wave.webaim.org/) - Accessibility testing
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - Color contrast

## 🤝 Community

- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join [Astro Discord](https://astro.build/chat) and find us there
- **Twitter**: Follow [@jdrhyne](https://twitter.com/jdrhyne) for updates

## 📄 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

## 🙏 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes
- Special thanks in README

---

**Remember**: Quality over quantity. A single well-crafted contribution aligned with our design philosophy is worth more than many that dilute the theme's focus.

Happy contributing! 🚀