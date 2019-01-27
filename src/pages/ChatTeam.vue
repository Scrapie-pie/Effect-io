<template lang="pug">
    article.chat-team
        .chat-team__content
            .chat-team__controls
                .chat-team__control
                    base-field(
                    type="search"
                    name="search",
                    placeholder="Поиск..."
                    theme="soft"
                    v-model="search"
                    )
                .chat-team__control
                    base-btn(name="add" color="success-dark" size="lg") Добавить сотрудника

            table.table
                thead.table__thead
                    tr.table__tr
                        th.table__td.table__td_th Имя
                        th.table__td.table__td_th
                        th.table__td.table__td_th Контакты
                        th.table__td.table__td_th Отдел
                        th.table__td.table__td_th Активен
                        th.table__td.table__td_th Досупные действия
                tbody.table__tbody
                    tr
                        td.table__td
                            base-people(type="operator" text="онлайн" name="Зеленков Александр")
                        td.table__td
                            base-btn(@click="startChat") Начать диалог

                        td.table__td
                            a(href="tel:+7 (921) 656-66-77") +7 (921) 656-66-77
                            br
                            a(href="mailto:mail@mail.ru")  ivan@effect.com
                        td.table__td Главный отдел
                        td.table__td
                            base-radio-check
                        td.table__td
                            context-menu
                                base-btn(:icon="{name:'edit',box:true,textHidden:'Открыть меню'}" color="info-lighten")

        base-no-found(v-if="!count" name="team")




        //table.table
            thead.table__thead
                tr.table__tr
                    th.table__td.table__td_th Имя
                    th.table__td.table__td_th Прикреплен сотрудник
                    th.table__td.table__td_th Контакты
                    th.table__td.table__td_th Регион
            tbody.table__tbody
                tr
                    td.table__td
                        base-people(type="operator" text="онлайн" name="Зеленков Александр")
                    td.table__td Вы можете начать диалог
                    td.table__td +7 (921) 656-66-77, mail@mail.ru
                    td.table__td Россия, Свердловская область, Екатеринбург

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
                search: ''
            }
        }
    }
</script>

<style lang="scss">
    .chat-team{


        &__controls{
            display:flex;
            align-items:center;
            margin-bottom:calc-em(50);
        }
        &__control{
            margin-right:calc-em(40);
        }

    }


</style>