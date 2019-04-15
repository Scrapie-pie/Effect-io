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
        field-name="chat_id"
        :item-list="itemList",
        @result="(val)=>filterSearchResult=val",
        @text="(val)=>search=val",
        )
        div(slot="control" v-if="itemListCount")
            |На странице показано {{showItemLength}} из {{ itemListCount}}

        base-table(v-if="showItemLength")
            thead
                tr
                    th Дата поступления
                    th ID
                    th Продолжительность
                    th Имя клиента

                    th Сообщения в диалоге
            tbody
                tr(v-for="(item, index) in itemList", :key="item.chat_id")
                    td {{item.date | datetimeDMY}}
                    td(v-text="item.chat_id")
                    td {{item.time | datetimeStoHMS}}
                    td(v-text="item.name")
                    td(v-text="item.messages_count")




</template>

<script>
    import {datetimeDMY,datetimeStoHMS,dialogPush } from '@/modules/modules'
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
                let {uuid,site_id} = item;

                dialogPush(this,'visor',item)
                return this.$router.push({name:'visor',params: { uuid, site_id}});


            },
            filterLast_days(val){
                //console.log(val);
                if (val==='-1') {

                    this.showCalendar=true;

                    /*     if (this.tempDates.length){
                             this.date_from = this.tempDates[0];
                             this.date_to = this.tempDates[1];
                             this.time_from = this.tempDates[2];
                             this.time_to = this.tempDates[3];
                         }
     */
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