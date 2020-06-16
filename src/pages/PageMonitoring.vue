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
                tr.page-monitoring__tr(v-for="(item, index) in itemList", :key="item.id")
                    td.page-monitoring__name {{item.fullName}}

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
            users_active:[],
            users_day_active:[],

        }
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
    computed:{
        itemList(){
            return this.$store.getters['operators/all'].map(operator=>{

                let users_activeFind = this.users_active.find(users_activeItem=>users_activeItem.user_id===operator.id)
                if(users_activeFind) {
                    operator.users_active = users_activeFind.count
                } else{
                    operator.users_active = 0
                }
                let users_day_activeFind = this.users_day_active.find(users_day_activeItem=>users_day_activeItem.user_id===operator.id)
                if(users_day_activeFind) {
                    operator.users_day_active = users_day_activeFind.count
                } else{
                    operator.users_day_active = 0
                }
                return operator
            })
        }
    },
    methods: {
        setData(r){
            this.branch_unprocessed = r.branch_unprocessed
            this.branch_active = r.branch_active
            this.branch_day_active = r.branch_day_active

            this.users_active=r.users_active
            this.users_day_active=r.users_day_active



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
