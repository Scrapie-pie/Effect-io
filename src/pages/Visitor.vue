<template lang="pug">
    article.chat-team.chat-team_visitors
        template(v-if="!count")
            .chat-team__controls
                .chat-team__control
                    base-field.chat-team__search(
                    type="search"
                    name="search",
                    placeholder="Поиск... (имя, тел., e-mail)"
                    v-model="search",
                    theme="soft"

                    )
                .chat-team__control
                    base-field(
                    type="select"
                    name="channel",
                    :selectOptions="{label:'name',options:channelList}"
                    v-model="channel"
                    )
                .chat-team__control
                    base-btn(@click="$root.$emit('popup','notFind')") Попап ограничения

            table.table
                thead.table__thead
                    tr.table__tr
                        th.table__td.table__td_th Имя
                        th.table__td.table__td_th Прикреплен сотрудник
                        th.table__td.table__td_th Контакты
                        th.table__td.table__td_th Регион
                tbody.table__tbody
                    tr.table__tr
                        td.table__td
                            base-people(type="visitor" name="Ксения" avatar-width="md")
                        td.table__td Вы можете начать диалог
                        td.table__td
                            a(href="tel:+7 (921) 656-66-77") +7 (921) 656-66-77
                            | ,
                            a(href="mailto:mail@mail.ru") ivan@effect.com
                        td.table__td Россия, Свердловская область, Екатеринбург
                    tr.table__tr
                        td.table__td
                            base-people(type="visitor" name="Ксения" avatar-width="md")
                        td.table__td
                            base-btn() Начать диалог
                        td.table__td
                            a(href="tel:+7 (921) 656-66-77") +7 (921) 656-66-77
                            | ,
                            a(href="mailto:mail@mail.ru") ivan@effect.com
                        td.table__td Россия, Свердловская область, Екатеринбург
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
                channel: '',
                channelList: []
            }
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

            this.$http('guest-get-by-operator').then(({data})=>{
                console.log(data);
            })
        },
        methods:{
            popupNotFind(){
                this.$root.$emit('popup-not-find');
                console.log(this.$root);
            }
        }
    }
</script>

<style lang="scss">
    .chat-team{

        &_visitors {
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

    }


</style>