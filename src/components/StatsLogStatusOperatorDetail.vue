<template lang="pug">
    base-table.stats-log-status-operator-list
        thead
            tr



                th IP
                th Время
                th Действие



        tbody
            tr(v-for="(item, index) in itemList" :key="item.id")
                td {{item.ip}}
                td {{item.time | datetimeDMY}} {{item.time | datetimeHMS}}
                td {{item.online | getStatusText}}



</template>

<script>


    import {datetimeDMY,datetimeHMS} from '@/modules/datetime'
import { stats, paginatorStats } from '@/mixins/mixins'

export default {
    components: {

    },
    filters: {
        datetimeDMY,datetimeHMS,
        getStatusText(numb) {
            return numb
            let text;
            switch (numb) {
                case 1:
                    text = 'В сети'
                    break
                case 2:
                    text = 'Перерыв'
                    break
                case 3:
                    text = 'Обед'
                    break
                default:
                    text = 'Не в сети'
                    break
            }
            return text
        }
    },
    mixins: [stats,
        //paginatorStats
    ],
    data() {
        return {

        }
    },
    computed: {


    },
    methods: {

    }
}
</script>

<style lang="scss">
.stats-log-status-operator-list {
    max-width:500px;
    width:auto;
}
</style>
