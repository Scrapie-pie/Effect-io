<template lang="pug">
    article.page-visitors
        .page-visitors__controls
            .page-visitors__control
                base-field.page-visitors__search(
                    type="search"
                    name="search",
                    placeholder="Поиск... (имя, тел., e-mail)"
                    v-model="search",
                    theme="soft"
                )
            .page-visitors__control
                base-field(
                    type="select"
                    name="channel",
                    :selectOptions="{label:'name',options:channelList,value:channel}"
                    v-model="channel"
                )
            .page-visitors__control
                |На странице показано {{showItemLength}} из {{ itemListCount}}
        scroll-bar(v-if="showItemLength" @ps-y-reach-end="loadDate").page-visitors__scroll-bar
            table.table
                thead.table__thead
                    tr.table__tr
                        th.table__td.table__td_th Имя
                        th.table__td.table__td_th Прикреплен сотрудник
                        th.table__td.table__td_th Контакты
                        th.table__td.table__td_th Регион
                tbody.table__tbody(v-for="(item, index) in itemList", :keey="item.uuid+item.site_id")
                    tr.table__tr.page-visitors__tr
                        td.table__td
                            base-people(
                                type="visitor"
                                :name="item.name"
                                avatar-width="md",
                                :avatar-url="item.photo"
                            )
                        td.table__td
                            base-btn.page-visitors__start-chat(v-if="!item.employee" :router="{name:'dialog'}") начать диалог
                            span(v-else v-text="item.employee")
                        td.table__td
                            a(:href="`tel:${item.phone}`" v-text="item.phone")
                            br(v-if="item.phone")
                            a(:href="`mailto:${item.mail}`" v-text="item.mail")
                        td.table__td
                            |{{item.country}}, {{item.region}}, {{item.city}}
        base-no-found(v-else name="visitors")
</template>

<script>
    import ContextMenu from '@/components/ContextMenu'
    import _ from 'underscore'
    export default {
        components: {
            ContextMenu
        },
        data() {
            return {
                getVisitorsListStart:true,
                search: '',
                limit:20,
                pageN:1,
                itemListCount: 0,
                itemList:[],
                channel: '',
                channelList: [
                    {id:null,name:"Все каналы"},
                    {id:7,name:"Effect.com"},
                    {id:1,name:"Веб-сайт (Виджет 1.0)"},
                    {id:2,name:"ВКонтакте"},
                    {id:3,name:"Facebook"},
                    {id:5,name:"Telegram"},
                    {id:6,name:"Viber"},
                    {id:4,name:"Slack"},
                    {id:8,name:"Slack (IO)"},
                    {id:9,name:"Zendesk"},
                    {id:1,name:"Salesforce"}],
            }
        },
        computed:{
            showItemLength(){
                return this.itemList.length
            },
            pageNLast(){
                return this.itemListCount / this.limit
            },
            getOffset(){
                return this.limit * (this.pageN - 1)
            },
            requestData(){
                return {
                    params:{
                        search:this.search,
                        offset:this.getOffset,
                        limit:this.limit,
                        channel_type:this.channel.id,
                    }
                }
            }
        },
        watch:{
            search:'debounceSearch',
            channel(){
                this.resetSearch();
                this.getVisitorsList();
            },
        },
        created() {
            this.channel = this.channelList[0];
        },
        methods:{
            debounceSearch:_.debounce(function()
                {
                    this.resetSearch();
                    this.getVisitorsList();
                }, 500),
            resetSearch(){
                this.pageN=1;
                this.itemListCount= 0;
                this.itemList=[];
                this.getVisitorsListStart=true;
            },
            loadDate(event){
                this.getVisitorsList()
            },
            getVisitorsList(){
                if(!this.getVisitorsListStart) return;

                this.getVisitorsListStart=false;

                if((this.showItemLength < this.itemListCount) || this.itemListCount===0) {
                    this.$http.get('guest-list',this.requestData).then(({data})=>{
                        this.getVisitorsListStart=true;
                        if (data.data.count) {
                            this.itemList.push(...data.data.list);
                            this.itemListCount = data.data.count;
                            this.pageN += 1;
                        }

                    })
                }

            },

        }
    }
</script>

<style lang="scss">
    .page-visitors{
        max-width:1300px;

        &__controls{
            display:flex;
            align-items:center;
            margin-bottom:calc-em(50);
        }
        &__control{
            margin-right:calc-em(20);
        }
        &__search{
            width:calc-em(250);
        }

        &__tr:not(:hover) &__start-chat {
            border:0;
            padding:0;
            color:inherit;
            background-color:transparent;
            transition-property:color;

            &::before {
                content:'Вы можете ';

            }
        }
        &__start-chat{
            text-decoration:none;
        }
        &__start-chat:first-letter {
            text-transform:uppercase;
        }
    }


</style>