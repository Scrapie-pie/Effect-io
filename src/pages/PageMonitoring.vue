<template lang="pug">
    the-layout-table.page-monitoring
        h1.h4(slot="control") Онлайн мониторинг
        base-wait(name="pageMonitoring")
        p.page-monitoring__turn
            strong Ожидает в очереди:   0
        base-table
            thead
                tr
                    th
                    th Активных
                    th Всего

            tbody
                tr.page-monitoring__tr(v-for="(item, index) in itemList", :key="item.id")
                    td.page-monitoring__name {{item.name}}

                    td {{item.active}}

                    td {{item.all}}




</template>

<script>



import TheLayoutTable from "@/components/TheLayoutTable";

export default {
    components: {
        TheLayoutTable


    },
    mixins: [],
    data() {
        return {
            itemList:[]
        }
    },
    computed: {


    },

    created() {
        this.itemList = [
            {name:'Общее',active:888,all:777},
            {name:'Екатерина Мальцева',active:888,all:777},
            {name:'Екатерина Мальцева',active:888,all:777},
            {name:'Екатерина Мальцева',active:888,all:777},
            {name:'Екатерина Мальцева',active:888,all:777},

        ]
    },
    methods: {

    }
}
</script>

<style lang="scss">
.page-monitoring {
 .base-table {
     width:auto;
 }
    &__name {
        white-space:nowrap;
    }
    &__turn {
        @extend %h1;
        padding:.7em 1em;
        border:2px solid glob-color(border);
        display:inline-block;
        width:100%;
        max-width:350px;
        text-align:center;
        margin-bottom:2em;
    }
}
</style>
