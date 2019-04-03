<template lang="pug">
    the-layout-table.page-log-dialogues(@scrolldown="scrollLoad")
        filter-drop-menu(name="period", @get="filterPeriod" slot="control" type="radio")
        filter-drop-menu(
            v-if="showCalendar"
            name="calendar",
            @get="filterCalendar"
            slot="control"
            )
        filter-drop-menu(
            name="channel",
            @get="filterChannel"
            slot="control"
        )
        filter-drop-menu(
            name="operator",
            @get="filterOperator"
            slot="control"
            )


        filter-drop-menu(
            name="status",
            @get="filterStatus"
            slot="control"
            )
        filter-drop-menu(
            name="ball",
            @get="filterBall"
            slot="control"
        )
        div(slot="control" v-if="itemListCount")
            |На странице показано {{showItemLength}} из {{ itemListCount}}

        base-table(v-if="showItemLength" )
            thead(v-if="headList.length")
                tr: th(v-for="(item, index) in headList" :key="index" v-html="item.text")
            tbody
                tr(v-for="(item, index) in itemListStore", :keey="item.uuid+item.site_id")
                    td
                        base-people(
                            type="visitor",
                            :name="item.name"
                            avatar-width="md",
                            :avatar-url="item.photo",
                            :avatar-stub="item.photo_stub"
                        )
                    td
                        base-btn.base-table__show-hover(
                        @click="startChat(item)"
                        ) Просмотреть диалог
                    td(v-text="item.date")
                    td(v-text="item.channel")
                    td
                        |{{item.queue_time | datetimeStoHMS}}
                    td.page-log-dialogues__ball
                        base-icon(:name="'ball'+item.rate")
                        |{{item.rate| ballText}}

        base-no-found(v-else name="visitors")

</template>

<script>
    import datetimeStoHMS from '@/modules/datetimeStoHMS'
    import TheLayoutTable from '@/components/TheLayoutTable'
    import FilterDropMenu from '@/components/FilterDropMenu'

    import {scrollbar,paginator } from '@/mixins/mixins'
    export default {
        mixins:[scrollbar,paginator],
        components: {
            FilterDropMenu,
            TheLayoutTable
        },
        filters:{
            datetimeStoHMS,
            ballText(value){
                if (value==1) return 'Плохо'
                if (value==2) return 'Средне'
                if (value==3) return 'Хорошо'
            }
        },
        data() {
            return {
                apiMethod:'chat-get-all',
                showCalendar:false,


                headList:[
                    {text:'Имя',field:'name'},
                    {text:'',field:'btn'},
                    {text:'Дата',field:'date'},
                    {text:'Канал',field:'channel'},
                    {text:'Ожидание в очереди',field:'channel'},
                    {text:'Оценка',field:'bal'},

                ],

                date_from:'',
                date_to:'',
                time_from:'',
                time_to:'',
                last_days:'',


                users_ids:[],
                sites_ids:[],
                branches_ids:[],
                statuses:[],
                rating:[],

                limit:11,
                containerFullFillItemListClassName:{
                    scrollBar:'layout-table__content',
                    item:'base-table__tr'
                },

            }
        },
        computed:{
            paramsComp(){
                return {
                    users_ids:this.users_ids,
                    sites_ids:this.sites_ids,
                    branches_ids:this.branches_ids,
                    statuses:this.statuses,
                    rating:this.rating,
                    date_from:this.date_from,
                    date_to:this.date_to,
                    time_from:this.time_from,
                    time_to:this.time_to,
                    last_days:this.last_days,
                }
            },
            itemListStore(){
                let itemList = [];
                console.log(this.$store.state.visitors.all);
                itemList=this.$store.state.visitors.all
                return itemList

            },

        },
        watch:{
            requestData(){

                this.getItemList();
            },
        },
        created() {


        },
        methods:{
            startChat(visitor){
                this.$router.push({name:'visor',params: { uuid: visitor.uuid,site_id:visitor.site_id}});
                return
                this.$http.put('guest-take', {
                    guest_uuid:visitor.uuid,
                    site_id:visitor.site_id
                })
                    .then(({ data }) => {
                        this.$router.push({name:'logDialogItem',params: { uuid: visitor.uuid,site_id:visitor.site_id}});
                    })
            },
            filterPeriod(val){
                //console.log(val);
                if (val===-1) {

                    this.showCalendar=true;
                    this.last_days='';
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

                this.date_from = val.date_from;
                this.date_to = val.date_to;
                this.time_from = val.time_from;
                this.time_to = val.time_to;
            },
            filterBall(val){
                //console.log(val);
                this.rating=val
            },
            filterChannel(val){
                //console.log(val);
            },
            filterStatus(val){
                //console.log(val);
                this.statuses=val;
            },
            filterOperator(val){
                //console.log(val);
                this.users_ids = val
            }

        },

    }
</script>

<style lang="scss">
    .page-log-dialogues{
        &__ball .icon {margin-right:calc-em(10)}




    }


</style>