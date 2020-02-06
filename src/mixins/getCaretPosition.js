import textWidthTagToText from '@/modules/textWidthTagToText'

export default {
    methods: {
        textWidthTagToText() {
            let ct = document.getElementById('contenteditable')

            return textWidthTagToText(ct)
        },
        getCharacterOffsetWithin_final(range, node) {
            var treeWalker = document.createTreeWalker(
                node,
                NodeFilter.ELEMENT_NODE,
                function(node) {
                    var nodeRange = document.createRange()
                    nodeRange.selectNodeContents(node)
                    return nodeRange.compareBoundaryPoints(Range.END_TO_END, range) < 1
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT
                },
                false
            )

            var charCount = 0,
                lastNodeLength = 0

            if (range.startContainer.nodeType == 3) {
                charCount += range.startOffset
            }

            while (treeWalker.nextNode()) {
                charCount += lastNodeLength
                lastNodeLength = 0

                if (range.startContainer != treeWalker.currentNode) {
                    if (treeWalker.currentNode instanceof Text) {
                        lastNodeLength += treeWalker.currentNode.length
                    } else if (
                        treeWalker.currentNode instanceof HTMLBRElement ||
                        treeWalker.currentNode instanceof
                            HTMLImageElement /* ||
                              treeWalker.currentNode instanceof HTMLDivElement*/
                    ) {
                        lastNodeLength++
                    }
                }
            }

            return charCount + lastNodeLength
        },
        getCaretPosition() {
            var range = window.getSelection()?.getRangeAt(0)

            this.$emit('getText', this.textWidthTagToText())

            this.$emit('caret', this.getCharacterOffsetWithin_final(range, this.$el))
        }
    },
    mounted() {
        this.$el.addEventListener('keyup', this.getCaretPosition)
        //this.$el.addEventListener('click', this.getCaretPosition);
        this.$el.addEventListener('mouseup', this.getCaretPosition)
    },
    beforeDestroy() {
        this.$el.removeEventListener('onkeyup', this.getCaretPosition)
        this.$el.removeEventListener('onmouseup', this.getCaretPosition)
    }
}
