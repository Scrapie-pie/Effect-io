<template lang="pug">
    the-layout-table

        base-btn(
            slot="control",
            name="add" color="success-dark" size="lg", :router="{name:'scenarioSettingsName',params:{scenarioId:-1}}"
        ) Добавить сценарий
        base-wait(name="pageScenarioList")
        base-table
            thead
                tr
                    th Описание
                    th Активен
                    th Сайт

                    th Досупные действия
            tbody
                tr(v-for="(item, index) in itemList", :key="item.id")
                    td
                        h4 {{item.title}}
                        p {{item.comment}}

                    td
                        base-radio-check(
                            :name="'active'+item.id",
                            :modelValue="item.active",  @click="changeActiveScenario(item)"
                        )
                    td: a(:href="'//'+item.site.url" target="_blank") {{item.site.url}}
                    td
                        context-menu
                            base-btn(:icon="{name:'edit',box:true,textHidden:'Открыть меню'}" color="info-lighten")
                            router-link(
                                slot="item",
                                :to="{name:'scenarioSettingsName',params:{scenarioId:item.id}}"
                            ) Редактировать
                            router-link(
                                slot="item",
                                :to="{name:'settingsProfile',query: { user_id: item.id }}"
                            ) Дублировать
                            base-btn(theme="link" slot="item", @click="removeScenario(item)") Удалить


</template>

<script>
import TheLayoutTable from '@/components/TheLayoutTable'
import lodash_cloneDeep from 'lodash/cloneDeep'
import ContextMenu from '@/components/ContextMenu'

export default {
    components: {
        ContextMenu,
        TheLayoutTable
    },

    data() {
        return {}
    },
    computed: {
        itemList() {
            let list = lodash_cloneDeep(this.$store.getters['scenario/gettersAll'])
            return list
                .filter(item => item.site_id === +this.$route.params.siteId)
                .map(item => {
                    item.site = this.$store.getters['user/siteCompanyListToId'](item.site_id)
                    return item
                })
        }
    },
    created() {},
    methods: {
        removeScenario({ id }) {
            this.$store.dispatch('scenario/removeItem', id)
        },
        changeActiveScenario(scenario) {
            console.log(scenario)
            let active = scenario.active ? 0 : 1,
                data = {
                    id: scenario.id,
                    active: active
                }
            this.$store.dispatch('scenario/changeItem', data)
        }
    }
}
</script>

<style lang="scss"></style>
