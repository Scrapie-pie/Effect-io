function textWidtTagToText(domEl) {
    let listText = []
    domEl.childNodes.forEach((item, index) => {
        delete item.onerror
        if (item.nodeName == 'BR') {
            listText[index] = '\n'
        } else if (item.nodeName == 'IMG') {
            listText[index] = item.attributes?.alt?.value
        } else {
            listText[index] = item.textContent
        }
    })

    return listText.join('')
}

export default textWidtTagToText
