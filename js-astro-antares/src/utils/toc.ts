/**
 * 获取下一个同类型的标题元素
 * @param titleElements 
 * @returns 
 */
export const mapNextSameHeadingElement = (titleElements: HTMLHeadingElement[]) => {
  const result = []
  const length = titleElements.length
  for (let i = 0; i < length; i++) {
    const currentElement = titleElements[i]
    const currentTag = currentElement.tagName.toLowerCase()
    // 寻找下一个同类型的标题
    let nextSameTagElement = null
    for (let j = i + 1; j < length; j++) {
      const nextElement = titleElements[j]
      const nextTag = nextElement.tagName.toLowerCase()
      if (nextTag <= currentTag) {
        nextSameTagElement = nextElement
        break
      }
    }
    // 将结果添加到数组中
    result.push({
      el: currentElement,
      next: nextSameTagElement,
    })
  }

  //处理只有一个h1的情况
  if (result.length == 1 && result[0].el.tagName.toLowerCase() == "h1" && !result[0].next) {
    result[0].next = result[result.length-1].el
  }

  return result
}
