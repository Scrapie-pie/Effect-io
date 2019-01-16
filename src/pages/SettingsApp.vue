<template lang="pug">
    section
        form
            ul.settings-list

                li.settings-list__item
                    h3.settings-list__name Уведомления
                    base-radio-check.settings-list__control.settings-list__select(name="notifications") Включить браузерные уведомления
                    text-info.settings-list__text-info Вы будете получать уведомления о важных событиях в виде стандартного уведомления браузера, даже если он будет свернут.

                li.settings-list__item
                    h3.settings-list__name Звук при новом сообщении от посетителя
                    base-field.settings-list__control.settings-list__select(
                    type="select",
                    :selectOptions="{label:'name',options:voiceList}"
                    name="voice"
                    )
                    text-info.settings-list__text-info Выберите звук, который будет проигрываться, если в Ваших текущих диалогах посетитель напишет новое сообщение.

                li.settings-list__item
                    h3.settings-list__name Звук, когда новый посетитель зашел на сайт
                    base-field.settings-list__control.settings-list__select(
                    type="select",
                    :selectOptions="{label:'name',options:voiceList}"
                    name="voice"
                    )
                    text-info.settings-list__text-info Выберите звук, который будет проигрываться, если новый посетитель зайдет на сайт. Вы сможете начать с ним диалог.

                li.settings-list__item
                    h3.settings-list__name Звук, когда другой сотрудник написал Вам новое сообщение
                    base-field.settings-list__control.settings-list__select(
                    type="select",
                    :selectOptions="{label:'name',options:voiceList}"
                    name="voice"
                    )
                    text-info.settings-list__text-info Выберите звук, который будет проигрываться, если кто-то из Вашей команды напишет Вам новое сообщение.

                li.settings-list__item
                    h3.settings-list__name Звук, когда есть новое сообщение в общем чате
                    base-field.settings-list__control.settings-list__select(
                    type="select",
                    :selectOptions="{label:'name',options:voiceList}"
                    name="voice"
                    )
                    text-info.settings-list__text-info Выберите звук, который будет проигрываться, если кто-то из Вашей команды напишет в общем чате, упомянув Вас.

                li.settings-list__item
                    h3.settings-list__name Язык приложения
                    base-field.settings-list__control.settings-list__select(
                    type="select",
                    :selectOptions="{label:'name',options:voiceList}"
                    name="voice"
                    )


                li.settings-list__item
                    h3.settings-list__name Звук при новом сообщении от посетителя
                    base-field.settings-list__control.settings-list__select(
                    type="select",
                    :selectOptions="{label:'name',options:voiceList,taggable:true,pushTags:true}"
                    name="voice"
                    multiple
                    )
                    text-info.settings-list__text-info Вы будете получать уведомления о важных событиях в виде стандартного уведомления браузера, даже если он будет свернут.

</template>

<script>


    import TextInfo from '@/components/TextInfo'


    export default {

        components: {
            TextInfo,
        },
        data() {
            return {
                voiceList: [
                    {name: '1'},
                    {name: '2'},
                    {name: '3'},
                ]
            }
        }
    }
</script>
