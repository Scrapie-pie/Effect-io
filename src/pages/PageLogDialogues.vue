<template lang="pug">
    the-layout-table.page-log-dialogues(@scrolldown="scrollLoad")
        filter-drop-menu(name="period", @get="filterPeriod" slot="control")
        filter-drop-menu(
            v-if="showCalendar"
            name="calendar",
            @get="filterCalendar"
            slot="control"
        )
        filter-drop-menu(
            name="operators",
            @get="filterOperators"
            slot="control"
        )
        div(slot="control" v-if="itemListCount")
            |На странице показано {{showItemLength}} из {{ itemListCount}}

        base-table(v-if="showItemLength" )
            thead(v-if="headList.length")
                tr: th(v-for="(item, index) in headList" :key="index" v-html="item.text")
            tbody
                tr.page-visitors__tr(v-for="(item, index) in itemList", :keey="item.uuid+item.site_id")
                    td
                        base-people(
                            type="visitor",
                            :name="item.name"
                            avatar-width="md",
                            :avatar-url="item.photo",
                            :avatar-stub="item.photo_stub"
                        )
                    td
        base-no-found(v-else name="visitors")
</template>

<script>

    import TheLayoutTable from '@/components/TheLayoutTable'
    import FilterDropMenu from '@/components/FilterDropMenu'


    import lodash_debounce from 'lodash/debounce'


    import {scrollbar,paginator } from '@/mixins/mixins'
    export default {
        mixins:[scrollbar,paginator],
        components: {

            FilterDropMenu,
            TheLayoutTable
        },
        data() {
            return {
                showCalendar:false,


                headList:[
                    {text:'Имя',field:'name'},
                    {text:'Дата',field:'date'},
                    {text:'Канал',field:'channel'},
                    {text:'Ожидание в очереди',field:'channel'},
                    {text:'Оценка',field:'bal'},

                ],

                date_from:null,
                date_to:null,
                time_from:null,
                time_to:null,
                lastDay:null,

                limit:5,
                containerFullFillItemListClassName:{
                    scrollBar:'layout-table__content',
                    item:'base-table__tr'
                },
                channel: '',
                channelList: [
                    {id:null,name:"Все каналы"},
                    {id:7,name:"Виджеты"},
                    {id:2,name:"ВКонтакте"},
                    {id:3,name:"Facebook"},
                    {id:5,name:"Telegram"},
                    {id:6,name:"Viber"},
                    {id:13,name:"WhatsApp"},
                    {id:4,name:"Slack"}
                ],
            }
        },
        computed:{
            paramsComp(){
                return {
                    channel_type:this.channel.id,
                }
            },

        },
        watch:{
            search:'debounceSearch',
            channel(){
                this.resetSearch();
                this.getItemList();
            },
        },
        created() {
            this.channel = this.channelList[0];
            this.$root.$on('guestNewSession',(val)=>{
                console.log('guestNewSession',val);
                val.name='Новый'
                this.itemList.unshift(val)
            })
            this.$root.$on('guestUpdate',(val)=>{
                console.log('guestUpdate');
                let findIndex = this.itemList.findIndex(item=>item.uuid+item.site_id === val.guest_uuid+val.site_id)
                if(findIndex!==-1) {
                    let itemUpdate = Object.assign(this.itemList[findIndex],val)
                    this.itemList.splice=(findIndex,1,itemUpdate)

                }
            })
        },
        methods:{
            startChat(visitor){
                this.$http.put('guest-take', {
                    guest_uuid:visitor.uuid,
                    site_id:visitor.site_id
                })
                    .then(({ data }) => {
                        this.$router.push({name:'chatId',params: { uuid: visitor.uuid,site_id:visitor.site_id}});
                    })
            },
            debounceSearch:lodash_debounce(function()
            {
                this.resetSearch();
                this.getItemList();
            }, 500),

            filterPeriod(val){

                if (val===-1) {

                    this.showCalendar=true;
                    this.lastDay=null;
                }
                else {
                    this.lastDay=val;
                    this.showCalendar=false;
                    this.date_from = null;
                    this.date_to = null;
                    this.time_from = null;
                    this.time_to = null;
                }
            },
            filterCalendar(val){
                console.log(val);

                this.date_from = val.date_from;
                this.date_to = val.date_to;
                this.time_from = val.time_from;
                this.time_to = val.time_to;
            },
            filterOperators(val){
                console.log(val);
            }



        },

    }
</script>

<style lang="scss">
    .page-log-dialogues{





    }


</style>