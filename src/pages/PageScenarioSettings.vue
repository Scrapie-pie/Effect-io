<template lang="pug">
        the-layout(:header-padding-no="true" @close="close").settings-page
            template(slot="title") Сценарии
            template(slot="nav" v-if="menuList.length")
                nav-main(:item-list="menuList")
            template(slot="main")
                 router-view
</template>

<script>
import { hideHeader, httpParams } from '@/mixins/mixins'
import TheLayout from '@/components/TheLayout'
import NavMain from '@/components/NavMain'
export default {
    components: { NavMain, TheLayout },
    mixins: [hideHeader, httpParams],
    computed: {
        menuList() {

            let list = [
                { text: 'Название и сайт', link: { name: 'scenarioSettingsName' } },
            ]

            if(this.$route.params.scenarioId!='-1') list = [list[0],
                { text: 'Содержание', link: { name: 'scenarioSettingsContent' } },
                { text: 'Условия', link: { name: 'scenarioSettingsConditions' } },
                { text: 'Расписание', link: { name: 'scenarioSettingsTimeTable' } }
            ]

            return list
        }
    },
    created() {},
    methods: {
        close() {
            this.$router.push({ name: 'scenarioList' })
        }
    }
}
</script>

<style lang="scss"></style>
