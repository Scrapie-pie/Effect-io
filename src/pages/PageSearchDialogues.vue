<template lang="pug">

    the-layout-table.page-log-dialogues(@scrolldown="scrollLoad")

        filter-drop-menu(name="last_days", @get="filterLast_days" slot="control" type="radio")

        filter-drop-menu(
        v-if="showCalendar"
        name="calendar",
        @get="filterCalendar"
        slot="control"

        )
        base-filter-search(
        slot="control",
        placeholder="Введите ID",

        @text="(val)=>search=val",
        )
        div(slot="control" v-if="itemListCount")
            |На странице показано {{showItemLength}} из {{ itemListCount}}

        base-table(v-if="showItemLength")
            thead
                tr
                    th Дата поступления
                    th
                    th ID
                    th Продолжительность
                    th Имя клиента

                    th Сообщения в диалоге
            tbody
                tr(v-for="(item, index) in itemList", :key="item.chat_id")
                    td
                        |{{item.date | datetimeDMY}}
                        br
                        |{{item.date | datetimeHMS}}
                    td
                        base-btn.base-table__show-hover(
                        @click="startChat(item)"
                        ) Просмотреть диалог
                    td(v-text="item.chat_id")
                    td {{item.time | datetimeStoHMS}}
                    td(v-text="item.name")
                    td(v-text="item.messages_count")




</template>

<script>
    import {dialogPush } from '@/modules/modules'
    import {datetimeDMY,datetimeHMS,datetimeStoHMS } from '@/modules/datetime'
    import TheLayoutTable from '@/components/TheLayoutTable'
    import FilterDropMenu from '@/components/FilterDropMenu'


    import {scrollbar,paginator } from '@/mixins/mixins'
    export default {
        mixins:[scrollbar,paginator],
        components: {
            TheLayoutTable,
            FilterDropMenu
        },
        filters:{
            datetimeDMY,
            datetimeStoHMS,
            datetimeHMS
        },
        data() {
            return {

                apiMethod:'chat-get-all',
                showCalendar:false,
                date_from:'',
                date_to:'',
                time_from:'',
                time_to:'',
                last_days:'',


                containerFullFillItemListClassName:{
                    scrollBar:'layout-table__content',
                    item:'base-table__tr'
                },

            }
        },
        computed:{
            paramsComp(){
                return {
                    with_messages_count:1,
                    date_from:this.date_from,
                    date_to:this.date_to,
                    time_from:this.time_from,
                    time_to:this.time_to,
                    last_days:this.last_days,
                }
            },


        },
        watch:{

            paramsComp(){
                if(this.last_days || (
                        this.date_from &&
                        this.date_to &&
                        this.time_from &&
                        this.time_to
                    )

                ) {
                    this.resetSearch()
                    this.getItemList();
                }


            },
        },
        created() {


        },
        methods:{
            startChat(item){
                let {uuid,site_id,chat_id} = item;

                dialogPush(this,'search',item,'chat_id')
                return this.$router.push({name:'search',params: { uuid, site_id,chat_id}});


            },
            filterLast_days(val){
                //console.log(val);
                if (val==='-1') {

                    this.showCalendar=true;
                }
                else {
                    this.last_days=val;
                    this.showCalendar=false;
                    this.date_from = '';
                    this.date_to = '';
                    this.time_from = '';
                    this.time_to = '';
                }
            },
            filterCalendar(val){
                //console.log(val);
                this.last_days='';
                this.date_from = val.date_from;
                this.date_to = val.date_to;
                this.time_from = val.time_from;
                this.time_to = val.time_to;

            },


        },

    }
</script>

<style lang="scss">




</style>