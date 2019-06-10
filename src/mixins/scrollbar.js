
export default {
    methods:{

        scrollbarScrollerPush(scrollbar,percent=100){
            //console.log('scrollerPushDown',scrollbar);
            let scrollerEl = scrollbar.$el,
                valPx = this.scrollerPxToPercent(scrollerEl, percent);
            scrollerEl.scrollTop = valPx;
            scrollbar.update()

        },
        scrollerPxToPercent(scroller,scrollTop){
            let height = scroller.clientHeight,
                scrollHeight = scroller.scrollHeight - height,
                percent = Math.floor(scrollTop * scrollHeight /100);
            return percent
        },
        scrollLoadAllow(e,direction='down'){
            const scroller = e.target
            let height = scroller.clientHeight,
                scrollHeight = scroller.scrollHeight - height,
                scrollTop = scroller.scrollTop,
                percent = Math.floor(scrollTop / scrollHeight * 100);
            if(direction==='down') {
                if ( percent > 80 ) {

                    return true
                }
            } else if(percent < 20) {

                return true
            }
        },

    },
}

