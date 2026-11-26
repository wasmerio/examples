import FacebookIcon from '@/assets/svg/facebook-icon'
import InstagramIcon from '@/assets/svg/instagram-icon'
import TwitterIcon from '@/assets/svg/twitter-icon'
import YoutubeIcon from '@/assets/svg/youtube-icon'

import { navigationData } from '@/components/sections/navigation'

import Logo from '@/components/logo'

const Footer = () => {
  return (
    <footer>
      <div className='mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 max-md:flex-col sm:px-8 sm:py-6 md:gap-6 md:py-8'>
        <a href='/#home'>
          <div className='flex items-center gap-3'>
            <Logo className='gap-3' />
          </div>
        </a>

        <div className='flex items-center gap-5 whitespace-nowrap lg:gap-12'>
          {navigationData.map(item => (
            <a
              key={item.title}
              href={item.href}
              className='text-muted-foreground hover:text-primary text-base! font-medium hover:bg-transparent'
            >
              {item.title}
            </a>
          ))}
        </div>

        <div className='flex items-center gap-4'>
          <a href='#' target='_blank'>
            <FacebookIcon className='size-5' />
          </a>
          <a href='#' target='_blank'>
            <InstagramIcon className='size-5' />
          </a>
          <a href='#' target='_blank'>
            <TwitterIcon className='size-5' />
          </a>
          <a href='#' target='_blank'>
            <YoutubeIcon className='size-5' />
          </a>
        </div>
      </div>

      <div className='via-primary/20 mx-auto h-px w-4/5 bg-gradient-to-r from-transparent to-transparent'></div>

      <div className='mx-auto flex max-w-7xl justify-center px-4 py-8 sm:px-6'>
        <p className='text-center font-medium text-balance'>
          {`©${new Date().getFullYear()}`}{' '}
          <a href='/#home' className='hover:underline'>
            Track
          </a>
          , Made with ❤️ for better web.
        </p>
      </div>
    </footer>
  )
}

export default Footer
