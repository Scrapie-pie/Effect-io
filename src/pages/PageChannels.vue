<template lang="pug">
    the-layout-table.page-channels
        filter-drop-menu(
            slot="control",
            name="siteCompany",
            all-output
            @get="ids=>filterChannelIds=ids"
            immediate-output

        )
        //base-btn(
            disabled
            slot="control",
            name="add" color="success-dark" size="lg" :router="{name:'settingsProfile',query:{add:'operator'}}"
            ) Добавить канал связи
        base-wait(name="pageСhannels")
        base-table
            thead
                tr
                    th Канал
                    th Тип канала
                    th Досупные действия
            tbody
                tr(v-for="(item, index) in itemList", :key="item.id")
                    td: a(:href="item.url" target="_blank") {{item.url}}
                    td {{$store.getters.channelName(item.channel_type) }}
                    td
                        context-menu
                            base-btn(:icon="{name:'edit',box:true,textHidden:'Открыть меню'}" color="info-lighten")
                            router-link.page-channels__link(
                                slot="item",
                                :to="{name:'scenarioList',params:{siteId:item.id}}"
                            ) Настроить сценарии


</template>

<script>
import TheLayoutTable from '@/components/TheLayoutTable'

import ContextMenu from '@/components/ContextMenu'
import FilterDropMenu from "@/components/FilterDropMenu";

export default {
    components: {
        FilterDropMenu,
        ContextMenu,
        TheLayoutTable
    },

    data() {
        return {
            filterChannelIds:[]

        }
    },
    computed: {
        itemList() {
            return this.$store.state.user.siteCompanyList.filter(item=>this.filterChannelIds.includes(item.id))
        }
    },
    created() {

    },
    methods: {

    }
}
</script>

<style lang="scss">
.page-channels {
    $transition: $glob-trans;
    $font-small: $glob-font-size_small;
    .layout-table__content {
        padding-bottom: calc-em(50);
    }
}
</style>
