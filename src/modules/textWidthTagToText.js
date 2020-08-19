function textWidthTagToText(domEl) {
    let listText = []
    domEl?.childNodes.forEach((item, index) => {
        delete item.onerror
        if (item.nodeName == 'BR') {
            listText[index] = '\n'
        } else if (item.nodeName == 'IMG') {
            listText[index] = item.attributes?.alt?.value
        } else {
            listText[index] = item.textContent
        }
    })


    listText = listText.join('')

    //listText =listText.replace(/</g, '&lt;')
    //listText =listText.replace(/>/g, '&gt;')

    return listText
}

export default textWidthTagToText
