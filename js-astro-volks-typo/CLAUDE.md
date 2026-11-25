# Volks-Typo Astro Theme

## Project Overview
A minimalist Astro blog theme with bold typography and a strong geometric design system. The theme emphasizes clarity, readability, and modern web aesthetics while maintaining a distinctive industrial character.

## Core Design Philosophy
- **Minimalist Foundation**: Clean, uncluttered aesthetic with generous white space
- **Bold Typography**: Strong typographic hierarchy with uppercase headings
- **Geometric Structure**: Consistent 8-point grid system for layout harmony
- **High Contrast**: Clear visual separation between elements

## Color Palette

### Monotone Base
- `#ffffff` (White) - Primary background
- `#f5f5f5` (Light Gray) - Surface backgrounds (header, footer, sidebar)
- `#888888` (Medium Gray) - Muted text, borders
- `#333333` (Dark Gray) - Secondary text
- `#000000` (Black) - Primary text

### Accent Color
- `#dc2626` (Red) - Primary accent for headings, links, and interactive elements

### Special Usage
- `#e8a100` (Ochre Yellow) - Category tags in search results (interactive state)
- `#c13127` (Dark Red) - Category tag hover state in search results
- `#000000` (Black) - Code block backgrounds with syntax highlighting

## Typography

### Headings - Industrial Strength
- **H1**: Oswald - 700 weight, uppercase, 0.15em letter-spacing
- **H2**: Roboto Condensed - 700 weight, uppercase, 0.1em letter-spacing  
- **H3**: Roboto Condensed - 600 weight, uppercase, 0.08em letter-spacing
- **Color**: Red accent (#dc2626) for all headings

### Body Text - Clean & Readable
- **Font**: Work Sans - 400 weight
- **Size**: 18px (1.125rem)
- **Line Height**: 1.6
- **Color**: Black (#000000)

### Monospace/Code
- **Font**: JetBrains Mono
- **Inline Code**: Light gray background with border
- **Code Blocks**: Black background with custom syntax highlighting

### Site Title
- **Implementation**: Custom SVG with Fraktur-style lettering
- **Height**: 48px (desktop), 36px (mobile)

## Layout Architecture

### Responsive Design
- Mobile/Tablet: Single column with hamburger menu
- Desktop (1024px+): Two-column with left sidebar (320px width)

### Core Components
1. **Layout.astro** - Main wrapper with CSS grid system
2. **Header.astro** - Sticky header with navigation, search, and RSS
3. **Sidebar.astro** - Author bio, recent posts, and categories
4. **Footer.astro** - Social links and copyright
5. **[...slug].astro** - Blog post template with thick red divider

## Interactive Features

### Search Functionality
- Full-text search overlay
- Real-time filtering of blog posts
- Highlighted categories with interactive color states

### Mobile Navigation
- Hamburger menu with slide-in navigation
- Separate mobile controls for RSS and search
- Touch-optimized interface

## Technical Implementation
- **Styling**: Astro Scoped CSS with CSS Variables
- **Colors**: CSS custom properties for theming
- **Fonts**: Self-hosted via @fontsource
- **Configuration**: Central src/config.ts file
- **Social Links**: GitHub, X, Instagram, LinkedIn, Email
- **Grid System**: 8-point grid unit for consistent spacing

## Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run type checking
npm run check
```