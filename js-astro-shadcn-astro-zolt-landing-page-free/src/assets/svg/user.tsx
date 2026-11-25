// React Imports
import type { SVGAttributes } from 'react'

const User = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22 22' width='24' height='24' fill='none' {...props}>
      <path
        d='M 8 6 C 8 3.791 9.791 2 12 2 C 14.209 2 16 3.791 16 6 C 16 8.209 14.209 10 12 10 C 9.791 10 8 8.209 8 6 Z'
        fill='currentColor'
      ></path>
      <path
        d='M 20 17.5 C 20 19.985 20 22 12 22 C 4 22 4 19.985 4 17.5 C 4 15.015 7.582 13 12 13 C 16.418 13 20 15.015 20 17.5 Z'
        fill='currentColor'
      ></path>
    </svg>
  )
}

export default User
