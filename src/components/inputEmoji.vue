<script>
import emojisBase from 'vue-emoji-picker/src/emojis'

let emojisBaseAll = [
    ...Object.entries(emojisBase['Frequently used']),
    ...Object.entries(emojisBase['People']),
    ...Object.entries(emojisBase['Nature']),
    ...Object.entries(emojisBase['Objects']),
    ...Object.entries(emojisBase['Places']),
    ...Object.entries(emojisBase['Symbols'])
]

import '@/scss/vendors/gl-16-emoji.css'
import lodash_split from 'lodash/split'
import { getCaretPosition } from '@/mixins/mixins'
import textWidthTagToText from '@/modules/textWidthTagToText'
import { wrapTextUrls } from '@/modules/modules'
export default {
    mixins: [getCaretPosition],
    props: {
        isNoBr: {
            type: Boolean,
            default: false
        },

        isEscapeTags:{
            type: Boolean,
            default: true
        },
        tag: {
            type: String,
            default: 'span'
        },
        isOutputText: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            default: ''
        },
        list: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    watch: {
        text(val) {
            this.$emit('getText', val)

            this.$emit('inputChange', val)

            if (this.isOutputText) return
            setTimeout(() => {
                this.placeCaretAtEnd(this.$el)
            }, 100)
        }
    },
    mounted() {},
    methods: {
        textToTextWidthTagEmoj({text,isOutputText=this.isOutputText,isEscapeTags=this.isEscapeTags}){

            if(isOutputText) {

                if(isEscapeTags) {
                    text = text
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                }

                text = text

                    .replace(/onerror/g, 'xss_off_onerror')

                text = this.wrapTextUrls(text)

                if(!this.isNoBr) text = this.messageBreakLine(text)
            }

            let splitStr = lodash_split(text, '')

            splitStr = splitStr.map(item => {

                if (!isOutputText) {
                    if (item == '\n') item = <br />
                }

                let find = emojisBaseAll.find(itemFind=>itemFind[1] == item)
                if (find) {
                    if (!Array.isArray(find)) return item

                    if (item.length > 1) {

                        let attrs = {
                            class:'gl-16 gl-16-' + find[0],
                            src:"data:image/svg+xml;utf8,<svg viewBox='0 0 0 0' version='1.1' xmlns='http://www.w3.org/2000/svg'><circle cx='0' cy='0' r='0'/></svg>",
                            alt:item
                        }

                        if (isOutputText) {
                            attrs = Object.entries(attrs).map(([key,value])=>`${key}="${value}" `).join('')
                            item = `<img ${attrs} />`
                        }
                        else {
                            item = <img attrs={attrs} />
                        }
                    }

                    return item

                } else {
                    return item
                }


            })

            return splitStr

        },
        wrapTextUrls,
        messageBreakLine(value) {
            return value.replace(/(\r\n|\n|&lt;br&gt;)/g, '<br>') // из виджета &lt;br&gt;
        },
        listenerCopy(e) {
            let listText = []
            e.currentTarget.childNodes.forEach((item, index) => {
                if (item.nodeName == 'BR') {
                    listText[index] = '\n'
                } else if (item.nodeName == 'A') {
                    listText[index] = item.attributes?.href?.value
                } else {
                    listText[index] = item.textContent
                }
            })

            e.clipboardData.setData('text/plain', listText.join(''))
            e.preventDefault()
        },
        listenerClearStylePaste(event) {
            let text = (event.clipboardData || window.clipboardData).getData('text/plain')




           /* text = text  .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/onerror/g, 'xss_off_onerror')
            text =  this.messageBreakLine(text)
            console.log(text);*/
            text =  this.textToTextWidthTagEmoj({text,isOutputText:true}).join('')

            /* const selection = window.getSelection();
            if (!selection.rangeCount) return false;
            selection.deleteFromDocument();
            selection.getRangeAt(0).insertNode(document.createTextNode(paste));*/

            event.preventDefault()

            //console.log(text);

            document.execCommand('inserthtml', false, text)
        },
        blur(e) {
            this.$emit('blur', '')
        },
        inputChange(e) {
            console.log('inputChange')
            this.$emit('inputChange', textWidthTagToText(e.target))
        },
        placeCaretAtEnd(el) {
            el.focus()
            if (
                typeof window.getSelection != 'undefined' &&
                typeof document.createRange != 'undefined'
            ) {
                var range = document.createRange()
                range.selectNodeContents(el)
                range.collapse(false)
                var sel = window.getSelection()
                sel.removeAllRanges()
                sel.addRange(range)
            } else if (typeof document.body.createTextRange != 'undefined') {
                var textRange = document.body.createTextRange()
                textRange.moveToElementText(el)
                textRange.collapse(false)
                textRange.select()
            }
        }
    },
    render(h) {

        let Tag = this.tag
        let splitStr = this.text

        splitStr =  this.textToTextWidthTagEmoj({text:splitStr})

        const attributes = {
            attrs: {
                class: 'input-emoji'
            },
        }


        if (this.isOutputText) {
            attributes.domProps={innerHTML: splitStr.join('')}

            return <Tag {...attributes} />
        } else {
            attributes.attrs={
                ...attributes.attrs,
                id: 'contenteditable',
                contenteditable: true,
                placeholder: 'Enter - отправить сообщение, Shift+Enter - новая строка.'
            }
            attributes.on = {
                input: this.inputChange,
                blur: this.blur,
                paste: this.listenerClearStylePaste
            }

            return <pre {...attributes}>{splitStr}</pre>
        }
    }
}
</script>

<style lang="scss">
.input-emoji {
    white-space: inherit;
    font-family: inherit;
    word-break: break-word;
    cursor: text;
    margin: 0;
    img {
        vertical-align: middle;
    }

    &[contenteditable='true']:empty:before {
        content: attr(placeholder);
        display: block; /* For Firefox */
        color: glob-color('placeholder');
        animation: fadeInFromNone 0.5s ease-out;
    }

    @keyframes fadeInFromNone {
        0% {
            display: none;
            opacity: 0;
        }

        1% {
            display: block;
            opacity: 0;
        }

        50% {
            display: block;
            opacity: 0;
        }

        100% {
            display: block;
            opacity: 1;
        }
    }
}
</style>
