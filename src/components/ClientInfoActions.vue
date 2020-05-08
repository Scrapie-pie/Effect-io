<template lang="pug">
    ul.client-info-actions(:class="{'client-info-actions_is-mobile':isMobile}")
        li.client-info-actions__item(v-if="info.regRuId")
            base-btn( type="a", :href="`https://desktop.reg.ru/card/user/${info.regRuId}/`" target="_blank" , :icon="{name:'regruDesctop',left:true}",) Открыть десктоп
            br
            base-btn( type="a", :href="`https://manager.reg.ru/manager/user_details?user_id=${info.regRuId}`" target="_blank" , :icon="{name:'regruManager',left:true}",) Открыть менеджер
        template(v-if="viewModeChat!='process'")
            li.client-info-actions__item
                base-btn(v-if="integrationRegru", :icon="{name:'regruOtrs',left:true}", @click="showFormORTS") Создать заявку в ОТРС
                base-btn(:icon="{name:'transferBranch',left:true}", @click="showBranch") Передать диалог в отдел

            li.client-info-actions__item
                base-btn(name="setTag", @click="showTags", :icon="{name:'tag',left:true}") Поставить тэг диалогу


</template>

<script>
import { httpParams, viewModeChat } from '@/mixins/mixins'
export default {
    name: 'ClientInfoActions',
    mixins: [viewModeChat, httpParams],
    props: {
        isMobile: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    computed: {
        integrationRegru() {
            return this.$store.state.user.siteCompanyList.find(
                item => item.id === this?.httpParams?.params.site_id && item.regruIntegration
            )
        },
        info() {
            return this.$store.state.visitors.itemOpen
        }
    },
    methods: {
        showBranch() {
            if (!this.isMobile) this.$root.$emit('showBranchPopup')
            else {
                this.$emit('close')
                this.$root.$emit('showBranchPopup')
            }
        },
        showFormORTS() {
            this.$emit('close')
            this.$root.$emit('formORTS')
        },
        showTags() {
            this.$emit('close')
            this.$root.$emit('showTagsEmit')
        }
    }
}
</script>

<style lang="scss">
.client-info-actions {
    &_is-mobile &__item {
        border: 0;
        padding: 0;
    }

    &__item {
        border-top: 1px solid glob-color(border);
        padding-top: calc-em(20);
        padding-bottom: calc-em(20);
        .icon {
            width: 15px;
            height: auto;
            max-height: 20px;
        }
    }
}
</style>
