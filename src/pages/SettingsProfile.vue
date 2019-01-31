<template lang="pug">
    section
        form
            ul.settings-list
                li.settings-list__item
                    .settings-list__upload-avatar
                        upload-avatar
                li.settings-list__item
                    .settings-list__upload-avatar
                    text-info.settings-list__text-info Загрузите фото, которое будут видеть Ваши коллеги и клиенты. Реальное фото всегда вызывает больше доверия.

                li.settings-list__item
                    .settings-list__name-wrap
                        base-field.settings-list__control.settings-list__field(
                        label="Введите имя сотрудника",
                        type="text",
                        name="name"
                        v-validate="'required|fulsd_ru|osbw'"
                        v-model="name"
                        )
                        base-field.settings-list__control.settings-list__field(
                        label="Введите фамилию сотрудника",
                        type="text",
                        name="name"
                        )
                    text-info.settings-list__text-info Используйте реальное имя, оно будет отображаться в диалогах с клиентами и другими сотрудниками. Фамилию вводить не обязательно.

                li.settings-list__item
                    base-field.settings-list__control.settings-list__field(
                    label="Введите e-mail сотрудника",
                    type="email",
                    name="email"
                    )
                    text-info.settings-list__text-info Используйте реальное имя, оно будет отображаться в диалогах с клиентами и другими сотрудниками. Фамилию вводить не обязательно.

                li.settings-list__item
                    .settings-list__row
                        .settings-list__col
                            base-field.settings-list__control.settings-list__select(
                            type="select",
                            :selectOptions="{label:'name',options:[{name:'Телефон'},{name:'Связь'}],default:{name:'Телефон'}}"
                            name="phones"
                            )
                        .settings-list__col
                        .settings-list__col
                            base-field.settings-list__control.settings-list__field(
                            label="Добавочный",
                            type="text",
                            name="phonePlus"
                            )

                    text-info.settings-list__text-info Телефон будет использоваться для приема звонков от клиентов. Если у Вас есть IP телефония, вы можете принимать звонки на sip аккаунт.

                li.settings-list__item
                    .settings-list__row
                        .settings-list__col
                            base-field.settings-list__control.settings-list__field(
                            label="Придумайте пароль",
                            type="text",
                            name="password"
                            )
                        .settings-list__col
                            base-field.settings-list__control.settings-list__field(
                            label="Повторите пароль",
                            type="text",
                            name="passwordConfirm"
                            )
                        .settings-list__col
                            base-btn() Сохранить пароль
                    text-info.settings-list__text-info Данный пароль используется для доступа к приложению сотрудника.

                li.settings-list__item
                    h3.settings-list__name Определить в отдел / отделы
                    base-field.settings-list__control(
                    type="select",
                    :selectOptions="{label:'name',options:voiceList,taggable:true,pushTags:true}"
                    name="voice"
                    multiple
                    )
                    text-info.settings-list__text-info Вы можете назначить сотрудника в один или несколько отделов. Чтобы выбрать отдел, начните набирать его название в данном поле.

                li.settings-list__item
                    h3.settings-list__name Настройки каналов
                    ul.settings-list__sub

                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(name="notifications") Включить права администратора
                            text-info.settings-list__text-info.settings-list__text-info_sub Если включена данная функция, Вы сможете общаться со своей командой в общем чате.

                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(name="notifications") Принимать звонки от клиентов

                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(name="notifications") Принимать чаты от клиентов

                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(name="notifications") Принимать чаты от клиентов из ВКонтакте

                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(name="notifications") Принимать чаты от клиентов из FaceBook

                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(name="notifications") Принимать звонки от клиентов

                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(name="notifications") Принимать звонки от клиентов

                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(name="notifications") Принимать звонки от клиентов
                            text-info.settings-list__text-info Выберите, в каких каналах данный сотрудник может общаться с клиентами.


                li.settings-list__item
                    h3.settings-list__name Настройки доступа
                    base-radio-check.settings-list__control(name="notifications") Включить права администратора
                    text-info.settings-list__text-info Права администратора позволяют сотруднику: управлять другими аккаунтами сотрудников, просматривать статистику, менять данные основного аккаунта, добавлять/удалять/ редактировать данные всех сотрудников, отделов и каналов связи.

</template>

<script>



    import TextInfo from '@/components/TextInfo'
    import UploadAvatar from '@/components/UploadAvatar'


    export default {

        components: {
            TextInfo, UploadAvatar
        },
        data() {
            return {
                name: '',
                voiceList: [
                    {name: '1'},
                    {name: '2'},
                    {name: '3'},
                ]
            }
        }
    }
</script>
