
export default {
    methods:{
        getCaretCharacterOffsetWithin(element) {
            var caretOffset = 0;
            var doc = element.ownerDocument || element.document;
            var win = doc.defaultView || doc.parentWindow;
            var sel;
            if (typeof win.getSelection != "undefined") {
                sel = win.getSelection();
                if (sel.rangeCount > 0) {
                    var range = win.getSelection().getRangeAt(0);
                    var preCaretRange = range.cloneRange();
                    preCaretRange.selectNodeContents(element);
                    preCaretRange.setEnd(range.endContainer, range.endOffset);
                    caretOffset = preCaretRange.toString().length;
                }
            } else if ((sel = doc.selection) && sel.type != "Control") {
                var textRange = sel.createRange();
                var preCaretTextRange = doc.body.createTextRange();
                preCaretTextRange.moveToElementText(element);
                preCaretTextRange.setEndPoint("EndToEnd", textRange);
                caretOffset = preCaretTextRange.text.length;
            }
            return caretOffset;
        },

        getCaretPosition() {
                window.sel=window.getSelection();
            if (window.getSelection && window.getSelection().getRangeAt) {
                var range = window.getSelection().getRangeAt(0);
                var selectedObj = window.getSelection();
                var rangeCount = 0;
                var childNodes = selectedObj.anchorNode.parentNode.childNodes;
                for (var i = 0; i < childNodes.length; i++) {
                    if (childNodes[i] == selectedObj.anchorNode) {
                        console.log(childNodes[i]);
                        break;
                    }
                    if (childNodes[i].outerHTML) {
                        console.log(childNodes[i].nodeName);
                        rangeCount += childNodes[i].outerHTML.length;
                    }

                    else if (childNodes[i].nodeType == 3) {
                        console.log(childNodes[i]);
                        rangeCount += childNodes[i].textContent.length;
                    }
                }
                console.log('getCaretPosition',range.startOffset + rangeCount);
                return range.startOffset + rangeCount;
            }
            return -1;
        },

    },
    mounted(){

        this.$el.addEventListener('keyup', this.getCaretPosition);
        //this.$el.addEventListener('click', this.getCaretPosition);
        this.$el.addEventListener('mouseup', this.getCaretPosition);

    },
    beforeDestroy(){
        this.$el.removeEventListener('onkeyup', this.getCaretPosition);
        this.$el.removeEventListener('onmouseup', this.getCaretPosition);


    }
}

