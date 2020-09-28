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
        box-controls.popup__select-tags(type="popup"  v-if="showTagsPopup", @boxControlClose="tagsClose")
            select-tags(:finish-chat="showTagsPopupFinishChat")
        box-controls.popup__select-branch(
            type="popup"
            v-if="showSelectBranch",
            @boxControlClose="showSelectBranch=false"
            )
            select-branch
        box-controls(type="popup" v-if="showFormORTS", @boxControlClose="showFormORTS=false")
            form-o-t-r-s
        box-controls.popup__select-operator(
            type="popup"
            v-if="showSelectOperatorsInvite",
            @boxControlClose="showSelectOperatorsInvite=false"
        )
            select-operators(name="invite")
        box-controls.popup__select-operator(
            type="popup"
            v-if="showSelectOperatorsTransfer",
            @boxControlClose="showSelectOperatorsTransfer=false"
        )
            select-operators(name="transfer")

</template>

<script>
import { httpParams } from '@/mixins/mixins'

export default {
    components: {
        SelectOperators: () => import('@/components/SelectOperators'),
        SelectTags: () => import('@/components/SelectTags'),
        SelectBranch: () => import('@/components/SelectBranch'),
        FormOTRS: () => import('@/components/FormOTRS')
    },
    mixins: [httpParams],
    data() {
        return {
            notFind: false,
            img: false,
            noticeText: false,
            showTagsPopup: false,
            showTagsPopupFinishChat: false,
            tagsActionAfter: true,
            showSelectBranch: false,
            showFormORTS: false,
            showSelectOperatorsInvite: false,
            showSelectOperatorsTransfer: false
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

        this.$root.$on('showSelectOperatorInvitePopup', () => {
            this.showSelectOperatorsInvite = true
        })
        this.$root.$on('showSelectOperatorTransferPopup', () => {
            this.showSelectOperatorsTransfer = true
        })

        this.$root.$on('showBranchPopup', () => {
            this.showSelectBranch = true
        })

        this.$root.$on('formORTS', () => {
            if (this.viewModeChat === 'process') {
                return
            }

            setTimeout(() => {
                this.showFormORTS = true
            }, 500)
        })
    },
    beforeDestroy() {
        this.$root.$off('showBranchPopup')
        this.$root.$off('formORTS')
        this.$root.$off('showTagsEmit', this.showTagsEmit)

        this.$root.$off('showSelectOperatorInvitePopup')
    },
    methods: {
        show(name) {
            this[name] = true
        },
        showImg(img) {
            this.img = img
        },
        showTagsEmit(actionAfter) {

            if(actionAfter==='actionAfterChatCompletion') {
                this.showTagsPopupFinishChat = true
            }

            this.$store.dispatch('tags/get')
            this.showTagsPopup = true
        },
        tagsClose(tag_id) {
            this.showTagsPopup = false
            this.showTagsPopupFinishChat = false
           /* console.log(this.tagsActionAfter)
            if (this.tagsActionAfter === 'actionAfterChatCompletion' && tag_id) {
                let data = this.httpParams.params
                data.intent = 'farewell'

                setTimeout(() => {
                    this.$http.post('message/send-from-operator', data)
                }, 500)
            }*/
        }
    }
}
</script>

<style lang="scss">
.popup {
    position: relative;
    z-index: 2; //иначе при открывание видно как слои местами меняются

    &__select-branch,
    &__select-operator,
    &__select-tags {
        @include media($width_xs) {
            .box-controls__box {
                width: 100%;
            }
        }
    }
}
</style>
