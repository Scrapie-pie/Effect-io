<template lang="pug">

        form(@submit.prevent="userUpdate")
            ul.settings-list
                li.settings-list__item
                    .settings-list__upload-avatar
                        upload-avatar(:url="model.avatar", @upload_url="getUploadAvatar")
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
                                v-model="phonesTypeSelect"
                                type="select",
                                :selectOptions="{label:'name',options:phonesType,value:phonesType[model.phones.type]}"
                                name="phones"
                            )
                        template(v-if="!model.phones.type")
                            .settings-list__col
                                tel-input(v-model="model.phones.phone" @unmaskedvalue="unmaskedvalue")
                            .settings-list__col
                                base-field.settings-list__control.settings-list__field(
                                    v-model="model.phones.additional"
                                    label="Добавочный",
                                    type="text",
                                    name="phoneAdditional"
                                )
                        template(v-else)
                            .settings-list__col
                                base-field(
                                    v-model="model.phones.sip"
                                    label="SIP URL",
                                    type="text"
                                    name="Sip"
                                )
                    text-info.settings-list__text-info Телефон будет использоваться для приема звонков от клиентов. Если у Вас есть IP телефония, вы можете принимать звонки на sip аккаунт.

                li.settings-list__item
                    password-refresh(@getPassword="setPassword", :hide-btn="isAddOperator")
                    text-info.settings-list__text-info Данный пароль используется для доступа к приложению сотрудника.

                li.settings-list__item
                    h3.settings-list__name Определить в отдел / отделы
                    base-field.settings-list__control(
                        v-model="branchListSelected"
                        type="select",
                        :selectOptions="{value:branchListSelected, label:'title',options:compBranchListRemaining}"
                        name="voice"
                        multiple,
                    )
                    text-info.settings-list__text-info Вы можете назначить сотрудника в один или несколько отделов. Чтобы выбрать отдел, начните набирать его название в данном поле.

                li.settings-list__item(v-if="viewAdmin")
                    h3.settings-list__name Настройки каналов
                    ul.settings-list__sub
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

                li.settings-list__item(v-if="viewAdmin && anotherProfile")
                    h3.settings-list__name Настройки доступа
                    base-radio-check.settings-list__control(
                        name="adminMode"
                        v-model="adminMode",

                    ) Включить права администратора
                    text-info.settings-list__text-info Права администратора позволяют сотруднику: управлять другими аккаунтами сотрудников, просматривать статистику, менять данные основного аккаунта, добавлять/удалять/ редактировать данные всех сотрудников, отделов и каналов связи.

            base-btn(type="submit") Сохранить
</template>

<script>
    //Todo добавить скролинг при ошибки к полю ошибки


    import PasswordRefresh from '@/components/PasswordRefresh'
    import TextInfo from '@/components/TextInfo'
    import UploadAvatar from '@/components/UploadAvatar'
    import TelInput from '@/components/TelInput'

    //const  TelInput = ()=> import('@/components/TelInput')

    export default {
        components: {
            TextInfo,
            UploadAvatar,
            PasswordRefresh,
            TelInput
        },
        watch:{
            profile:{
                handler(val){
                    if(val) {
                        this.getProfileByUserId()
                    }
                },
                immediate: true
            },
            branchListAll:{
                handler(val){
                    if(val) {

                        this.branchListSelected = val.filter((item)=>{
                            return this.model.branches_ids.includes(item.id)
                        });
                    }
                },
                immediate: true

            },
            phonesTypeSelect(val){
                this.model.phones.type = val.value
            },
            branchListSelected(val) {
                this.model.branches_ids = val.map((item) => {
                    return item.id
                })
            },
            adminMode(val){
                if(val) {
                    this.model.role_id = 13
                } else this.model.role_id = 6
            }
        },
        data() {
            return {

                isAddOperator:!!this.$route.query.add,
                phoneUnmaskedValue:'',
                phonesTypeSelect:{},
                phonesType:[
                    {
                        name:'Телефон',
                        value:0
                    },
                    {
                        name:'Sip',
                        value:1
                    }
                ],
                model:{
                    pass:'', //нужен для создания нового оператора
                    user_id:null,
                    owner_id:null, //нужен для проверки userIdNoOwner()
                    avatar:null,
                    first_name:null,
                    last_name:null,
                    phone:null,
                    phones:{
                        type:1,
                        phone:'',
                        sip:'',
                    },
                    mail:null,
                    role_id:null,
                    is_common_chat:null,
                    branches_ids:[],
                    use_chat:null,
                    use_calls:null,
                },
                adminMode:null,
                branchListSelected:[],
                branchListAll:[]
            }
        },

        computed:{
            branches_ids(){
                return this.model.branches_ids
            },
            profile(){
                return this.$store.getters['user/profile']
            },
            anotherProfile(){
                return  this.model.user_id !== this.profile.user_id
            },
            viewAdmin(){
                return  this.profile.role_id === 13 || this.profile.role_id === 5 //либо админ либо владелец
            },
            compBranchListRemaining(){
                let list = this.branches_ids;
                return this.branchListAll.filter((item)=>{
                    return !list.includes(item.id)
                });
            },
        },
        created(){
            //this.clearFormValue();

        },
        methods:{
            getBranchListAll(){
                if(this.$store.state.user.branchListAll.length) {
                    this.branchListAll = this.$store.getters['user/branchListAll']
                } else {
                    this.$store.watch(
                        (state)=>state.user.branchListAll,
                        (val) => {
                            return this.branchListAll = val
                    });
                }
            },
            fillProfile(){

                this.model.user_id=this.profile.user_id,
                this.model.owner_id=this.profile.owner_id, //нужен для проверки userIdNoOwner()
                this.model.avatar=this.profile.avatar,
                this.model.first_name=this.profile.first_name,
                this.model.last_name=this.profile.last_name,
                this.model.phone=this.profile.phone,
                this.model.phones=this.profile.phones,
                this.model.mail=this.profile.mail,
                this.model.role_id=this.profile.role_id,
                this.model.is_common_chat=this.profile.is_common_chat,
                this.model.branches_ids=this.profile.branches_ids,
                this.model.use_chat=this.profile.use_chat,
                this.model.use_calls=this.profile.use_calls

                this.adminMode=this.profile.role_id === 13;
                this.getBranchListAll()
            },
            setPassword(val){
                this.model.pass = val
            },
            clearFormValue(){

                if(!this.isAddOperator) return;
                for (let prop in this.model) {
                    if (prop == 'phones') {
                        this.model[prop].phone ='';
                        this.model[prop].additional ='';
                        this.model[prop].sip ='';
                    } else this.model[prop] = '';

                    this.role_id = 6


                }
            },
            getProfileByUserId(){

                if(!!this.isAddOperator) {

                    this.getBranchListAll()

                    return

                }

                let user_id = + this.$route.query.user_id;
                if(user_id) {

                    if (user_id == this.profile.user_id) return this.fillProfile()



                    this.$http.get('user-profile', {params:{user_id:user_id}}).then(({data})=>{
                        if(data.success) {
                            this.model=data.data.user;
                            this.getBranchListAll()
                        }
                    }).catch((errors)=>{
                        if (errors.response.status == 404) this.$router.push({name:'process'})

                    })
                } else {
                    this.fillProfile()
                }

            },
            unmaskedvalue(val){
                this.phoneUnmaskedValue=val;

            },
            getUploadAvatar(event){
                this.model.avatar=event;
            },
            createOperator(){
                this.$http.post('admin-employee-create', this.model).then(({data})=>{

                    this.$router.push({name:'team'})
                })
            },
            userUpdate(){

                this.$validator.validateAll().then(response => {
                    if (response) {

                        this.model.phones.phone= this.phoneUnmaskedValue;

                        if(this.isAddOperator) {
                            return  this.createOperator()
                        }

                        this.$http.post('user-update', this.model).then(()=>{
                            this.$router.push({name:'team'})
                        }).catch(({response})=>{
                            console.log('errors');
                            console.log(response.data);

                            if(response.data.errors) { // добавляет ошибки с бека в валидатор
                                for (let prop in response.data.errors) {
                                    let id = this.$validator.fields.find({ name: prop });
                                    let err = {
                                        field: prop,
                                        msg:response.data.errors[prop].message,
                                        id:id
                                    };
                                    this.errors.add(err);
                                    this.$validator.flag(prop, {
                                        valid: false,
                                        dirty: true
                                    });
                                }


                            }
                        })
                    }

                });


            }
        }
    }
</script>
