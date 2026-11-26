/// <reference types="astro/client" />
import 'react';

// Extend HTMLAttributes to include AMP-specific attributes
declare module 'react' {
    interface HTMLAttributes<T> {
        overflow?: string;
    }
    
    namespace JSX {
        interface IntrinsicElements {
            'amp-ad': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                width?: string;
                height?: string;
                type?: string;
                'data-ad-client'?: string;
                'data-ad-slot'?: string;
                'data-auto-format'?: string;
                'data-full-width'?: string;
            };
        }
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'amp-ad': any;
        }
    }
}

export {};
