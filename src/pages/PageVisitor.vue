<template lang="pug">
    the-layout-table.page-visitors
        base-field.page-visitors__search(
            slot="control",
            type="search"
            name="search",
            placeholder="Поиск... (имя, тел., e-mail)"
            v-model="search",
            theme="soft"
        )

        base-field(
            slot="control",
            type="select"
            name="channel",
            :selectOptions="{label:'name',options:channelList,value:channel}"
            v-model="channel"
        )

        div(slot="control" v-if="itemListCount")
                |На странице показано {{showItemLength}} из {{ itemListCount}}
        scroll-bar(v-if="showItemLength" ref="scrollbar" , @ps-scroll-down="scrollLoad").page-visitors__scroll-bar
            base-table
                thead
                    tr
                        th Имя
                        th Прикреплен сотрудник
                        th Контакты
                        th Регион
                tbody
                    tr.page-visitors__tr(v-for="(item, index) in itemList", :keey="item.uuid+item.site_id")
                        td
                            base-people(
                                type="visitor"
                                :name="item.name"
                                avatar-width="md",
                                :avatar-url="item.photo",
                                :avatar-stub="item.photo_stub"
                            )
                        td
                            base-btn.page-visitors__start-chat(
                                v-if="!item.employee",
                                @click="startChat(item)"
                            ) начать диалог
                            span(v-else v-text="item.employee")
                        td
                            a(:href="`tel:${item.phone}`" v-text="item.phone")
                            br(v-if="item.phone")
                            a(:href="`mailto:${item.mail}`" v-text="item.mail")
                        td
                            |{{item.country}}, {{item.region}}, {{item.city}}
        base-no-found(v-else name="visitors")
</template>

<script>
    import ContextMenu from '@/components/ContextMenu'
    import TheLayoutTable from '@/components/TheLayoutTable'


    import lodash_debounce from 'lodash/debounce'
    import lodash_extend from 'lodash/extend'

    import {scrollbar } from '@/mixins/mixins'
    export default {
        mixins:[scrollbar],
        components: {

            ContextMenu,
            TheLayoutTable
        },
        data() {
            return {
                getItemListStart:true,
                search: '',
                limit:20,
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
            scrollLoad(e){
                console.log(this.scrollLoadAllow(e));
                if(this.scrollLoadAllow(e)) this.getItemList()
            },
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
            resetSearch(){
                this.pageN=1;
                this.itemListCount= 0;
                this.itemList=[];
                this.getItemListStart=true;
            },

            getItemList(){
                if(!this.getItemListStart) return;

                this.getItemListStart=false;
                console.log(this.showItemLength,this.itemListCount,this.itemListCount);
                if((this.showItemLength < this.itemListCount) || this.itemListCount===0) {
                    console.log('getItemList');
                    this.$http.get('guest-list',this.requestData).then(({data})=>{
                        this.getItemListStart=true;
                        if (data.data.count) {
                            this.itemList.push(...data.data.list);
                            this.itemListCount = data.data.count;
                            this.pageN += 1;
                            console.log(this.showItemLength,this.itemListCount,this.itemListCount);
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
            height:100%;
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