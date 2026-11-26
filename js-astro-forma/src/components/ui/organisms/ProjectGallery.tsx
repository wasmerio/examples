import { useLayoutEffect, useRef, useState } from 'react';
import MorphGallery from '../molecules/MorphGallery';
import { getResponsiveImageSrcSet } from '@utils/responsive-image';

type Project = { image: string; alt: string; category: string; title: string; description: string };
type Props = { projects: { title: string; description: string; items: Project[] }; mode?: 'morph' | 'editorial'; refined?: boolean; selectionLabel?: string; locale?: 'pl' | 'en' };

export default function ProjectGallery({ projects, mode = 'morph', refined = false, selectionLabel, locale = 'en' }: Props) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{ left: number; top: number; width: number } | null>(null);
  const current = projects.items[active];
  const items = projects.items.map((project) => ({ src: project.image, alt: project.alt }));
  const editorial = mode === 'editorial';
  const highlighted = hovered ?? focused ?? active;
  const resolvedSelectionLabel = selectionLabel ?? (locale === 'en' ? 'Choose a project' : 'Wybierz realizację');

  useLayoutEffect(() => {
    if (editorial) return;
    const selection = selectionRef.current;
    const button = buttonRefs.current[highlighted];
    if (!selection || !button) return;

    // Jeden wskaźnik wraca do wyboru po opuszczeniu paska i dopasowuje się po zmianie szerokości.
    const measure = () => setIndicator({
      left: button.offsetLeft,
      top: button.offsetTop,
      width: button.offsetWidth,
    });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(selection);
    observer.observe(button);
    return () => observer.disconnect();
  }, [highlighted, editorial]);

  return (
    <div className={`gallery gallery--${mode}${refined ? ' gallery--refined' : ''}`}>
      <div className="gallery-photo">
        {/* Zdjęcie zostaje widoczne także przed hydracją i przy braku WebGL. */}
        <img className="gallery-poster" src={current.image} srcSet={getResponsiveImageSrcSet(current.image, 1600)} sizes="(max-width: 900px) 100vw, 65vw" alt="" width={1600} height={1067} loading="lazy" decoding="async" />
        <MorphGallery
          items={items}
          height="100%"
          index={active}
          onIndexChange={setActive}
          arrows={false}
          thumbnails={false}
          duration={1200}
          drift={0.08}
          className="gallery-renderer"
          accessibilityLabel={locale === 'en' ? 'Project gallery' : 'Galeria realizacji'}
          previousLabel={locale === 'en' ? 'Previous photo' : 'Poprzednie zdjęcie'}
          nextLabel={locale === 'en' ? 'Next photo' : 'Następne zdjęcie'}
          showItemLabel={(item, index) => locale === 'en'
            ? `Show ${item.alt || `photo ${index + 1}`}`
            : item.alt ? `Pokaż ${item.alt}` : `Pokaż zdjęcie ${index + 1}`}
        />
      </div>
      {!editorial && (
        <header className="gallery-heading">
          <h2>{projects.title}</h2>
          <p>{projects.description}</p>
        </header>
      )}
      <div className="gallery-content">
        {!editorial && (
          <div className="gallery-caption" aria-live="polite" aria-atomic="true">
            {!refined && <span>{current.category} <span aria-hidden="true">/</span> 0{active + 1}</span>}
            <h3>{current.title}</h3>
            <p>{current.description}</p>
          </div>
        )}
        <div
          className="gallery-selection"
          ref={selectionRef}
          role="group"
          aria-label={resolvedSelectionLabel}
          onPointerLeave={() => setHovered(null)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocused(null);
          }}
        >
          {!editorial && <span
            className="gallery-selection-indicator"
            aria-hidden="true"
            data-ready={indicator !== null}
            style={indicator ? {
              width: indicator.width,
              transform: `translate(${indicator.left}px, ${indicator.top}px)`,
            } : undefined}
          />}
          {projects.items.map((project, index) => (
            <button
              type="button"
              key={project.image}
              ref={(button) => { buttonRefs.current[index] = button; }}
              aria-pressed={active === index}
              onClick={() => setActive(index)}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse' || event.pointerType === 'pen') setHovered(index);
              }}
              onFocus={() => {
                setHovered(null);
                setFocused(index);
              }}
            >
              <span className="gallery-project">
                <span className="gallery-category">{project.category}</span>
                <span className="gallery-project-title">{project.title}</span>
                {editorial && <span className="gallery-description">{project.description}</span>}
              </span>
              <span className="gallery-arrow arrow-loop--inline" aria-hidden="true"><span className="arrow-loop-out">↗</span><span className="arrow-loop-in" aria-hidden="true">↗</span></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
