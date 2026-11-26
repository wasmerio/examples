'use strict'
import { version } from '../../package.json'

const styleVerName =
    'font-size: 14px; color: #000; background-color: #faca82; padding: 5px 9px; border-radius: 3px 0 0 3px; margin: 10px 0;'
const styleVerValue =
    'font-size: 14px; color: #fff; background-color: #607d8b; padding: 5px 9px; border-radius: 0 3px 3px 0; margin: 6px 0;'
console.log('%c%s%c%s', styleVerName, 'Rudeus Theme', styleVerValue, `v${version}`)
