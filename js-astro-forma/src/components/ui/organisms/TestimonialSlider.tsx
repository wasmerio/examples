import { useState } from 'react';
import { getResponsiveImageSrcSet } from '@utils/responsive-image';

type Review = { quote: string; author: string; initials: string; project: string; detail: string; image: string; alt: string; avatars: string[] };
type Labels = { aria: string; previous: string; next: string; demo: string };
type Props = { items: Review[]; mode: 'balanced' | 'slide' | 'project' | 'editorial' | 'spread' | 'centered' | 'framed' | 'quiet'; labels?: Labels };

export default function TestimonialSlider({ items, mode, labels }: Props) {
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const [direction, setDirection] = useState(1);
  const review = items[active];

  function move(step: number) {
    setManual(true);
    setDirection(step);
    setActive((index) => (index + step + items.length) % items.length);
  }

  return (
    <div className={`review review--${mode}`} role="region" aria-roledescription={labels ? 'carousel' : 'karuzela'} aria-label={labels?.aria ?? 'Przykładowe opinie klientów'}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          move(event.key === 'ArrowLeft' ? -1 : 1);
        }
      }}>
      <div className="review-stage" aria-live={manual ? 'polite' : 'off'} aria-atomic="true">
        <figure key={active} className={`review-slide${direction < 0 ? ' review-slide--previous' : ''}`}>
          {['project', 'spread', 'framed', 'quiet'].includes(mode) && <img className="review-image" src={review.image} srcSet={getResponsiveImageSrcSet(review.image, 1600)} sizes="(max-width: 900px) 100vw, 50vw" alt={review.alt} width="1600" height="1067" loading="lazy" decoding="async" />}
          <div className="review-story">
            <span className="review-mark" aria-hidden="true">“</span>
            <span className="review-project">{review.project}</span>
            <blockquote><p>{review.quote}</p></blockquote>
            <figcaption>
              <span className="review-portraits" aria-hidden="true">{review.avatars.map((src) => <img key={src} className="review-avatar" src={src} alt="" width="128" height="128" loading="lazy" />)}</span>
              <span className="review-author"><strong>{review.author}</strong><span>{review.detail}</span><small>{labels?.demo ?? 'Opinia demonstracyjna'}</small></span>
            </figcaption>
          </div>
        </figure>
      </div>
      <div className="review-controls">
        <div className="review-arrows">
          <button type="button" aria-label={labels?.previous ?? 'Poprzednia opinia'} onClick={() => move(-1)}><span className="arrow-loop--inline arrow-loop--l" aria-hidden="true"><span className="arrow-loop-out">←</span><span className="arrow-loop-in" aria-hidden="true">←</span></span></button>
          <button type="button" aria-label={labels?.next ?? 'Następna opinia'} onClick={() => move(1)}><span className="arrow-loop--inline arrow-loop--r" aria-hidden="true"><span className="arrow-loop-out">→</span><span className="arrow-loop-in" aria-hidden="true">→</span></span></button>
        </div>
      </div>
    </div>
  );
}
