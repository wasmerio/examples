# Help

Short answers to the questions buyers ask most. Start with the README for installation and deployment.

## The build stops with "villa.config.ts has N problem(s)"

Read the list: each line gives the path of the faulty field.

- `translation hero.title: missing de`: add a `de:` line to that text, or remove `'de'` from `languages.active`.
- `gallery[3].image: "x.jpg" is not in src/assets/photos/`: copy the photo there, or fix the file name.
- `needs at least 5 decimals`: copy the coordinates from a map with more precision (`43.22134`, not `43.22`). A value ending with 0 loses it as a number: write it as a string, `'43.22130'`.
- `booking.key: ... is not a Formspree form ID` (or a Web3Forms key): copy the key again from the service, the message shows what it looks like.
- `property.timeZone: ... is not a time zone name`: use the IANA name, e.g. `Europe/Paris`.
- `photo ... letters without accents`: rename the file (`vue-mer.jpg`, not `vue mer été.jpg`). Upper-case extensions (`.JPG`) are fine.

## My photos look cropped

Photos are cropped to fixed shapes (3:2 in the gallery, 4:5 for the main house photo). Keep the subject in the centre. For the big photo at the top, `object-position` is set to `center 30%` in `src/components/hero.astro`: change it if the horizon is cut.

## The form says "Your request was not sent"

- Check `booking.key` in `villa.config.ts` (Web3Forms access key or Formspree form ID), then rebuild.
- Web3Forms: confirm your email address from the first message they sent you.
- Formspree: turn reCAPTCHA off in the form settings (the theme sends with JavaScript).
- The guest can still send the request: the error message offers WhatsApp and email with the text already written.



## Remove the demo notice

Delete `demoNotice` in `site` of `villa.config.ts`.

## Legal pages

`/legal/` and `/privacy/` are filled from `legal`, `contact` and `property` in `villa.config.ts`; empty details show `[to complete]` and the build reminds you. If your company already publishes a legal notice, set `legal.noticeUrl`: the page links to it instead of listing the publisher. The texts live in `src/i18n/legal.ts`. They are templates, not legal advice: have them checked for your country.

## Update Astro

```sh
npx @astrojs/upgrade
npm run check && npm test && npm run build
```

## Report a bug

Send the command you ran, the full error message and your Node.js version (`node -v`) to the address given with your purchase.
