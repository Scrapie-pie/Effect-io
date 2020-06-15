export default {
    data() {
        return {
            CMSPA_scrollDownButtonShow: false
        }
    },
    methods: {
        CMSPA_chatDown() {
            this.scrollbarScrollerPush(this.$refs.scrollbar)
            this.scrollDownButtonShow = false
        },
        CMSPA_scrollbarScrollerPush(isScrollPushUser) {
            let isScrollPush = false

            if (
                Math.ceil(this.$refs.scrollbar.$el.scrollTop) ===
                this.scrollerPxToPercent(this.$refs.scrollbar.$el, 100)
            ) {
                isScrollPush = true
            }

            if (isScrollPushUser) isScrollPush = isScrollPushUser

            setTimeout(() => {
                if (isScrollPush) {
                    this.scrollbarScrollerPush(this.$refs.scrollbar)
                    this.CMSPA_scrollDownButtonShow = false
                } else {
                    this.CMSPA_scrollDownButtonShow = true
                }
            }, 50)
        }
    }
}
//Если пришло сообщение и скроллбар внизу то прокручиваем до конца вниз, иначе показываем кнопку что есть сообщения
