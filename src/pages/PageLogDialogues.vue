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
                tr(v-for="(item, index) in itemList", :keey="item.uuid+item.site_id")
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
                    td(v-text="datetimeStoHMS(item.queue_time)")
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
            ballText(value){
                if (value==1) return 'Плохо'
                if (value==2) return 'Средне'
                if (value==3) return 'Хорошо'
            }
        },
        data() {
            return {
                showCalendar:false,
                ball:3,

                headList:[
                    {text:'Имя',field:'name'},
                    {text:'',field:'btn'},
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

            }
        },
        computed:{
            paramsComp(){
                return {

                }
            },

        },
        watch:{

        },
        created() {
            this.getItemList()
        },
        methods:{
            startChat(visitor){
                this.$router.push({name:'logDialogItem',params: { uuid: visitor.uuid,site_id:visitor.site_id}});
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
                //console.log(val);

                this.date_from = val.date_from;
                this.date_to = val.date_to;
                this.time_from = val.time_from;
                this.time_to = val.time_to;
            },
            filterBall(val){
                //console.log(val);
            },
            filterChannel(val){
                //console.log(val);
            },
            filterStatus(val){
                //console.log(val);
            },
            filterOperator(val){
                //console.log(val);
            }

        },

    }
</script>

<style lang="scss">
    .page-log-dialogues{
        &__ball .icon {margin-right:calc-em(10)}




    }


</style>