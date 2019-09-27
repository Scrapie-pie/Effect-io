<template lang="pug">
    section.popup
        box-controls(v-if="!!noticeText", type="notice", @boxControlClose="noticeText=false")
            span(slot="text" v-html="noticeText")
            base-btn(@click="noticeText=false") Понятно
        box-controls(v-if="notFind", type="popup", @boxControlClose="notFind=false")
            template(slot="text") Поиск не работает в start версии
            base-btn Посмотреть тарифы
        box-controls(v-if="img",  type="gallery", @boxControlClose="img=false")
            img(:src="img" alt="Увеличенная картинка")
        box-controls(type="popup"  v-if="showTagsPopup", @boxControlClose="tagsClose")
            select-tags
</template>

<script>
export default {
    components:{
        SelectTags:()=>import('@/components/SelectTags')
    },
    data() {
        return {
            notFind: false,
            img: false,
            noticeText: false,
            showTagsPopup:false,
            tagsActionAfter:true,
        }
    },
    computed: {},
    created() {
        this.$root.$on('popup', this.show)
        this.$root.$on('popup-img', this.showImg)
        this.$root.$on('popup-notice', text => {
            this.noticeText = text
        })

        this.$root.$on('showTagsEmit', this.showTagsEmit)
    },
    beforeDestroy() {
        this.$root.$off('showTagsEmit', this.showTagsEmit)

    },
    methods: {
        show(name) {
            this[name] = true
        },
        showImg(img) {
            this.img = img
        },
        showTagsEmit(actionAfter) {
            this.tagsActionAfter  = actionAfter;
            this.$store.dispatch('tags/get')
            this.showTagsPopup = true

        },
        tagsClose(){
            this.showTagsPopup =false;
            if(this.tagsActionAfter==='actionAfterChatCompletion') {
                let data = this.httpParams.params
                data.intent = 'farewell'

                this.$http.post('message/send-from-operator', data)
            }
        }
    }
}
</script>

<style lang="scss">
.popup {
    position: relative;
    z-index: 2; //иначе при открывание видно как слои местами меняются
}
</style>
