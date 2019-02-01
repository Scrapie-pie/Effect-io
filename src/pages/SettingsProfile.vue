<template lang="pug">

        form(@submit="userUpdate")
            ul.settings-list
                li.settings-list__item
                    .settings-list__upload-avatar
                        upload-avatar(:url="model.avatar")
                li.settings-list__item
                    .settings-list__upload-avatar
                    text-info.settings-list__text-info Загрузите фото, которое будут видеть Ваши коллеги и клиенты. Реальное фото всегда вызывает больше доверия.

                li.settings-list__item
                    .settings-list__name-wrap
                        base-field.settings-list__control.settings-list__field(
                            label="Введите имя сотрудника",
                            type="text",
                            name="first_name"
                            v-model="model.first_name"

                        )
                        base-field.settings-list__control.settings-list__field(
                        label="Введите фамилию сотрудника",
                        type="text",
                        name="last_name"
                        v-model="model.last_name"
                        )
                    text-info.settings-list__text-info Используйте реальное имя, оно будет отображаться в диалогах с клиентами и другими сотрудниками. Фамилию вводить не обязательно.

                li.settings-list__item
                    base-field.settings-list__control.settings-list__field(
                    label="Введите e-mail сотрудника",
                    type="email",
                    name="email"
                    v-model="model.mail"
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
                    password-refresh(setClass="settings-list")
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




                    ul.settings-list__sub()

                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(name="is_common_chat" v-model="model.is_common_chat") Подключиться к общему чату
                            text-info.settings-list__text-info.settings-list__text-info_sub Если включена данная функция, Вы сможете общаться со своей командой в общем чате.

                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(name="use_calls" v-model="model.use_calls") Принимать звонки от клиентов

                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(name="use_chat" v-model="model.use_chat") Принимать чаты от клиентов

                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(v-if="0" name="notifications") Принимать чаты от клиентов из ВКонтакте

                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(v-if="0" name="notifications") Принимать чаты от клиентов из FaceBook

                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(v-if="0" name="notifications") Принимать звонки от клиентов

                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(v-if="0" name="notifications") Принимать звонки от клиентов

                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(v-if="0" name="notifications") Принимать звонки от клиентов
                            text-info.settings-list__text-info Выберите, в каких каналах данный сотрудник может общаться с клиентами.


                li.settings-list__item(v-if="$store.getters['user/isRole']=='owner'")
                    h3.settings-list__name Настройки доступа
                    base-radio-check.settings-list__control(
                        name="admin_mode"
                        v-model="admin_mode",

                    ) Включить права администратора
                    text-info.settings-list__text-info Права администратора позволяют сотруднику: управлять другими аккаунтами сотрудников, просматривать статистику, менять данные основного аккаунта, добавлять/удалять/ редактировать данные всех сотрудников, отделов и каналов связи.

            base-btn(@click="userUpdate" size="lg" color="success-dark") Сохранить
</template>

<script>



    import PasswordRefresh from '@/components/PasswordRefresh'
    import TextInfo from '@/components/TextInfo'
    import UploadAvatar from '@/components/UploadAvatar'


    export default {

        components: {
            TextInfo, UploadAvatar, PasswordRefresh
        },
        watch:{
            admin_mode(val){
                if(val) {
                    this.model.role_id = 13
                } else this.model.role_id = 5

            }
        },
        data() {
            return {

                model:{
                    user_id:this.$store.getters['user/profile'].user_id,
                    avatar:this.$store.getters['user/profile'].avatar,
                    first_name:this.$store.getters['user/profile'].first_name,
                    last_name:this.$store.getters['user/profile'].last_name,
                    phone:this.$store.getters['user/profile'].phone,
                    mail:this.$store.getters['user/profile'].mail,
                    role_id:this.$store.getters['user/profile'].role_id,
                    is_common_chat:this.$store.getters['user/profile'].is_common_chat,
                    branches_ids:this.$store.getters['user/profile'].branches_ids,
                    use_chat:this.$store.getters['user/profile'].use_chat,
                    use_calls:this.$store.getters['user/profile'].is_common_chat,
                },
                admin_mode:this.$store.getters['user/profile'].role_id == 13,
                voiceList: [
                    {name: '1'},
                    {name: '2'},
                    {name: '3'},
                ]
            }
        },
        computed:{

        },
        created(){

        },
        beforeRouteLeave (to, from, next) {

            this.userUpdate().then(({data})=>{
                console.log(data);
            }).catch(()=>{

            })


        },
        methods:{
            userUpdate(){

             return this.$http.post('user-update', this.model)
            }
        }



    }
</script>
