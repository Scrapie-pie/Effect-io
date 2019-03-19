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
            .page-visitors__control(v-if="itemListCount")
                |На странице показано {{showItemLength}} из {{ itemListCount}}
        scroll-bar(v-if="showItemLength" @ps-y-reach-end="loadDate").page-visitors__scroll-bar
            table.table
                thead.table__thead
                    tr.table__tr
                        th.table__th Имя
                        th.table__th Прикреплен сотрудник
                        th.table__th Контакты
                        th.table__th Регион
                tbody.table__tbody(v-for="(item, index) in itemList", :keey="item.uuid+item.site_id")
                    tr.table__tr.page-visitors__tr
                        td.table__td
                            base-people(
                                type="visitor"
                                :name="item.name"
                                avatar-width="md",
                                :avatar-url="item.photo",
                                :avatar-stub="item.photo_stub"
                            )
                        td.table__td
                            base-btn.page-visitors__start-chat(
                                v-if="!item.employee",
                                @click="startChat(item)"
                            ) начать диалог
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



    import lodash_debounce from 'lodash/debounce'
    import lodash_extend from 'lodash/extend'
    export default {
        components: {
            ContextMenu
        },
        data() {
            return {
                getVisitorsListStart:true,
                search: '',
                limit:10,
                pageN:1,
                itemListCount: 0,
                itemList:[],
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

        },
        sockets:{

        }
    }
</script>

<style lang="scss">
    .page-visitors{


        &__scroll-bar {
            max-width:1300px;
        }

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