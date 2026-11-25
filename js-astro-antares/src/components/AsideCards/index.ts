import CardBase from './CardBase.astro'
import CardInfo from './CardInfo.astro'
import CardRecentPost from './CardRecentPost.astro'
import CardCategroies from './CardCategroies.astro'
import CardTagCloud from './CardTagCloud.astro'
import CardTableOfContents from './CardTableOfContents.astro'
import CardMarkdown from './CardMarkdown.astro'
import CardToolbar from './CardToolbar.astro'
import CardSiteInfo from './CardSiteInfo.astro'
type Card = (_props: any) => any
const cards = {
  CardBase,
  CardInfo,
  CardRecentPost,
  CardCategroies,
  CardTagCloud,
  CardTableOfContents,
  CardMarkdown,
  CardToolbar,
  CardSiteInfo
}
type CardName =
  | 'CardBase'
  | 'CardInfo'
  | 'CardRecentPost'
  | 'CardCategroies'
  | 'CardTagCloud'
  | 'CardTableOfContents'
  | 'CardMarkdown'
  | 'CardToolbar'
  | 'CardSiteInfo'

const getCardByName = (name: string|CardName) => {
  const cardNameAllow = Object.keys(cards)
  if (!cardNameAllow.includes(name)) {
    throw new Error(`Card [${name}] not exist or is not exported, available cards: ${cardNameAllow.join(', ')}`)
  }
  return cards[name as CardName]
}
//参数允许为 'CardBase' / {CardBase:props} / [CardBase,props] / ['CardBase',props] / CardBase
//统一输出为 [Card,props]
export type EnsuredCardParams = Card | CardName | string | [ Card | CardName | string , any | undefined] | { [key in CardName]: any | undefined }
export const ensuredCard = (p: EnsuredCardParams) => {
  let card, props = {}
  if (typeof p === 'string') {
    card = getCardByName(p)
  } else if (Object.keys(cards).includes(Object.keys(p).at(0)||'_')) {
    card = getCardByName(Object.keys(p)[0])
    props = Object.values(p)[0]
  } else if (Array.isArray(p)) {
    let [ cardNameOrCard, _props = {} ] = p
    card = (typeof cardNameOrCard === 'string') ? getCardByName(cardNameOrCard) : cardNameOrCard as Card
    props = _props
  } else {
    card = p
  }
  return [card, props] as [Card, any]
}

export default cards