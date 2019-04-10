<template lang="pug">
    article.page-all
        nav-aside.page-all__filter-list(v-if="0")
            scroll-bar.page-all__scrollbar
                filter-drop-menu(name="period", @get="filterPeriod"  type="radio")
                filter-drop-menu(
                v-show="showCalendar"
                name="calendar",
                @get="filterCalendar"


                )
                filter-drop-menu(
                name="siteCompany",
                @get="filterChannel"

                )
                filter-drop-menu(
                name="operator",
                @get="filterOperator"

                )


                filter-drop-menu(
                name="status",
                @get="filterStatus"

                )
                filter-drop-menu(
                name="ball",
                @get="filterBall"

                )
                filter-drop-menu(
                name="url",
                type="radio",
                @get="filterUrl"

                )
        the-layout-table.page-log-dialogues(@scrolldown="scrollLoad")

            filter-drop-menu(name="period", @get="filterPeriod" slot="control" type="radio")
            filter-drop-menu(
                v-show="showCalendar"
                name="calendar",
                @get="filterCalendar"
                slot="control"

                )
            filter-drop-menu(
                name="siteCompany",
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
            filter-drop-menu(
                name="url",

                @get="filterUrl"
                slot="control"
            )
            div(slot="control" v-if="itemListCount")
                |На странице показано {{showItemLength}} из {{ itemListCount}}

            base-table(v-if="showItemLength")
                thead(v-if="headList.length")
                    tr: th(v-for="(item, index) in headList" :key="index" v-html="item.text")
                tbody
                    tr(v-for="(item, index) in itemList", :key="item.uuid+item.site_id+item.chat_id")
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
                        td
                            |{{item.date | datetimeDMY }}
                        td(v-text="item.channel")
                        td
                            |{{item.queue_time | datetimeStoHMS}}
                        td.page-log-dialogues__ball
                            base-icon(:name="'ball'+item.rating")
                            |{{item.rating| ballText}}



</template>

<script>
    import {datetimeDMY,datetimeStoHMS,dialogPush } from '@/modules/modules'
    import TheLayoutTable from '@/components/TheLayoutTable'
    import FilterDropMenu from '@/components/FilterDropMenu'
    import NavAside from '@/components/NavAside'

    import {scrollbar,paginator } from '@/mixins/mixins'
    export default {
        mixins:[scrollbar,paginator],
        components: {
            FilterDropMenu,
            TheLayoutTable,
            NavAside
        },
        filters:{
            datetimeDMY,
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

                users_ids:[],
                sites_ids:[],
                branches_ids:[],
                statuses:[],
                rates:[],
                date_from:'',
                date_to:'',
                time_from:'',
                time_to:'',
                last_days:'',
                url:null,




                tempDates:[],


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
                    rates:this.rates,
                    date_from:this.date_from,
                    date_to:this.date_to,
                    time_from:this.time_from,
                    time_to:this.time_to,
                    last_days:this.last_days,
                    url:this.url,
                }
            },


        },
        watch:{

            paramsComp(){
                //console.log('paramsComp');

                if((
                    this.users_ids.length &&
                    this.sites_ids.length &&
                    this.statuses.length &&
                    this.rates.length &&
                    this.url!== null
                    ) &&
                    this.last_days ||
                    (
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

                dialogPush(this.$store,'visor',item)
                return this.$router.push({name:'visor',params: { uuid, site_id}});


            },
            filterPeriod(val){
                //console.log(val);
                if (val==='-1') {

                    this.showCalendar=true;

                    if (this.tempDates.length){
                        this.date_from = this.tempDates[0];
                        this.date_to = this.tempDates[1];
                        this.time_from = this.tempDates[2];
                        this.time_to = this.tempDates[3];
                    }

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

                this.tempDates=[this.date_from,this.date_to,this.time_from,this.time_to]
            },
            filterBall(val){
                //console.log(val);
                this.rates=val
            },
            filterChannel(val){
                this.sites_ids = val
                //console.log(val);
            },
            filterStatus(val){
                //console.log(val);
                this.statuses=val;
            },
            filterOperator(val){
                //console.log(val);
                this.users_ids = val
            },
            filterUrl(val){
                //console.log(val);
                this.url = val
            }

        },

    }
</script>

<style lang="scss">
    .page-all {
        flex-direction: row;
        &__scrollbar {
            height:100%;
            padding-left:calc-em(10);
            padding-right:calc-em(10);
        }
        &__filter-list {
            margin-right:calc-em(15);

            .filter-drop-menu{
                &__box {
                    opacity: 1;
                    visibility: visible;
                    -webkit-transform: translateY(0);
                    transform: translateY(0);
                    position:static;
                }
                &__controls-item{

                    white-space:normal;
                }
                margin-bottom:calc-em(20);

                .base-radio-check__text-wrap {
                    white-space:normal;
                }
            }

        }
    }
    .page-log-dialogues{
        &__ball .icon {margin-right:calc-em(10)}




    }


</style>