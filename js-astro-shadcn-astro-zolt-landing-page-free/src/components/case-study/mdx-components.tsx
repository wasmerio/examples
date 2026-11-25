import type { ReactNode } from 'react'

import { CheckIcon } from 'lucide-react'

// Text elements get a centered, narrower column; images/raw blocks stay full-width of the parent.
const PROSE_WIDTH = 'mx-auto w-full max-w-xl'

type HeadingProps = { id?: string; children?: ReactNode }
type ChildrenProps = { children?: ReactNode }
type ImgProps = { src?: string; alt?: string }

const H1 = ({ id, children }: HeadingProps) => (
  <h1 id={id} className={`${PROSE_WIDTH} text-4xl font-bold`}>
    {children}
  </h1>
)

const H2 = ({ id, children }: HeadingProps) => (
  <h2 id={id} className={`${PROSE_WIDTH} text-accent mt-24 scroll-mt-20 text-xl font-medium italic sm:text-[22px]`}>
    {children}
  </h2>
)

const H3 = ({ id, children }: HeadingProps) => (
  <h3 id={id} className={`${PROSE_WIDTH} text-accent mt-6 scroll-mt-20 text-lg font-medium italic sm:text-xl`}>
    {children}
  </h3>
)

const H4 = ({ id, children }: HeadingProps) => (
  <h4 id={id} className={`${PROSE_WIDTH} mt-4 scroll-mt-20 text-lg font-medium`}>
    {children}
  </h4>
)

const P = ({ children }: ChildrenProps) => <p className={`${PROSE_WIDTH} mt-2 text-base`}>{children}</p>

const Ul = ({ children }: ChildrenProps) => <ul className={`${PROSE_WIDTH} mt-4 space-y-3`}>{children}</ul>

const Ol = ({ children }: ChildrenProps) => <ol className={`${PROSE_WIDTH} mt-4 list-decimal pl-6`}>{children}</ol>

const Li = ({ children }: ChildrenProps) => (
  <li className='bg-card ring-border flex items-start gap-2 rounded-md p-3 ring-1'>
    <span className='bg-accent text-accent-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full'>
      <CheckIcon className='size-3' />
    </span>
    <span className='text-base font-medium'>{children}</span>
  </li>
)

const Hr = () => <hr className={`${PROSE_WIDTH} my-6`} />

const Img = ({ src, alt }: ImgProps) => (
  <img src={src} alt={alt ?? ''} className='mt-6 w-full rounded-2xl border shadow-sm' />
)

const Blockquote = ({ children }: ChildrenProps) => (
  <blockquote
    className={`${PROSE_WIDTH} border-accent text-foreground mt-6 border-l-2 bg-(--background-darker) p-2 pl-3 text-lg font-medium italic [&_p]:mt-0`}
  >
    {children}
  </blockquote>
)

export const mdxComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  p: P,
  ul: Ul,
  ol: Ol,
  li: Li,
  hr: Hr,
  img: Img,
  blockquote: Blockquote
}
