<template lang="pug">
    the-layout-table.page-monitoring
        h1.h4(slot="control") Онлайн мониторинг
        base-wait(name="pageMonitoring")
        p.page-monitoring__turn(:class="{'error':branch_unprocessed}")
            strong Ожидает в очереди:   {{branch_unprocessed}}
        base-table
            thead
                tr
                    th
                    th Активных
                    th Всего

            tbody
                tr.page-monitoring__tr
                    td.page-monitoring__name Общее

                    td {{branch_active}}

                    td {{branch_day_active}}
                tr.page-monitoring__tr(v-for="(item, index) in itemList", :key="item.user_id")
                    td.page-monitoring__name {{item.name}}

                    td {{item.users_active}}

                    td {{item.users_day_active}}




</template>

<script>



import TheLayoutTable from "@/components/TheLayoutTable";
import {apiMonitoring} from "@/api/api";

export default {
    components: {
        TheLayoutTable


    },
    mixins: [],
    data() {
        return {
            branch_unprocessed:0,
            branch_active:0,
            branch_day_active:0,


            itemList:[]
        }
    },
    computed: {
        count(){
            return 1
        },



    },

    created() {
        this.$root.$on('emitMonitoring',this.setData)
        apiMonitoring.get().then(r=>{


            this.setData(r)

        })
















    },
    beforeCreate(){
        this.$root.$off('emitMonitoring',this.setData)
    },
    methods: {
        setData(r){
            this.branch_unprocessed = r.branch_unprocessed
            this.branch_active = r.branch_active
            this.branch_day_active = r.branch_day_active

            this.itemList=r.users_active.map(({user_id,count},index)=>{


                let operator = this.$store.getters['operators/all'].find(
                    itemSub => itemSub.id === user_id
                )

                if (operator) return {
                    user_id,
                    name:operator.fullName,
                    users_active:count,
                    users_day_active:r.users_day_active[index].count
                }
                else return {}

            })
        }
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
        &.error {
            background-color:glob-color('error');
            border-color:glob-color('error');
            color:glob-color('light');
        }
    }
}
</style>
