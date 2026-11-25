// React Imports
import type { SVGProps } from 'react'

const CalendarIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' {...props}>
      <path
        d='M 22 14 L 22 12 C 22 11.161 22 10.415 21.987 9.75 L 2.013 9.75 C 2 10.415 2 11.161 2 12 L 2 14 C 2 17.771 2 19.657 3.172 20.828 C 4.343 22 6.229 22 10 22 L 14 22 C 17.771 22 19.657 22 20.828 20.828 C 22 19.657 22 17.771 22 14 Z'
        fill='currentColor'
      ></path>
      <path
        d='M 7.75 2.5 C 7.75 2.086 7.414 1.75 7 1.75 C 6.586 1.75 6.25 2.086 6.25 2.5 L 6.25 4.079 C 4.811 4.195 3.866 4.477 3.172 5.172 C 2.477 5.866 2.195 6.811 2.079 8.25 L 21.921 8.25 C 21.805 6.811 21.523 5.866 20.828 5.172 C 20.134 4.477 19.189 4.195 17.75 4.079 L 17.75 2.5 C 17.75 2.086 17.414 1.75 17 1.75 C 16.586 1.75 16.25 2.086 16.25 2.5 L 16.25 4.013 C 15.585 4 14.839 4 14 4 L 10 4 C 9.161 4 8.415 4 7.75 4.013 Z'
        fill='currentColor'
      ></path>
    </svg>
  )
}

export default CalendarIcon
