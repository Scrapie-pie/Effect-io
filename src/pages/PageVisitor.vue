<template lang="pug">
    article.page-visitors
        template(v-if="!count")
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
                    :selectOptions="{label:'name',options:channelList}"
                    v-model="channel"
                    )


            table.table
                thead.table__thead
                    tr.table__tr
                        th.table__td.table__td_th Имя
                        th.table__td.table__td_th Прикреплен сотрудник
                        th.table__td.table__td_th Контакты
                        th.table__td.table__td_th Регион
                tbody.table__tbody(v-for="(item, index) in itemList", :key="item.uuid+item.site_id")
                    tr.table__tr.page-visitors__tr
                        td.table__td
                            base-people(
                                type="visitor"
                                name="Ксения"
                                avatar-width="md",
                                :avatar-url="item.photo"
                            )
                        td.table__td
                            template(v-if="!item.employee")
                                base-btn.page-visitors__start-chat(:router="{name:'dialog'}") начать диалог
                            template(v-else)
                                |{{item.employee}}

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

    export default {
        components: {
            ContextMenu
        },

        data() {
            return {
                count:0,

                search: '',
                offset:0,
                limit:0,
                channel: '',
                channelList: [],
                itemList:[],
                itemListCount: 0,

            }
        },
        watch:{
            search:'getVisitorsList'
        },
        created() {
            this.channelList = [
                {name: 'Все каналы'},
                {name: 'Effect.com'},
                {name: 'ВКонтакте'},
                {name: 'Facebook'},
                {name: 'Slack'},
                {name: 'Viber'},
                {name: 'Skype'},
            ]
            this.channel = this.channelList[0];


        },
        methods:{
            getVisitorsList(){
                let params= {
                    search:this.search,
                    offset:this.offset,
                    limit:this.limit,
                };

                this.$http.get('guest-company-list',{params}).then(({data})=>{
                    this.itemList = data.data.list
                    this.itemListCount = data.data.count
                })
            },
            popupNotFind(){
                this.$root.$emit('popup-not-find');
                console.log(this.$root);
            }
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