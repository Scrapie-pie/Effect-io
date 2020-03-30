<template lang="pug">

        form(@submit.prevent="userUpdate")
            base-wait(name="pageSettingsProfile")
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
                    text-info.settings-list__text-info E-mail будет использоваться как логин для входа в приложения, и так же для важных уведомлений.

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
                        :selectOptions="{value:branchListSelected, label:'titleAndSite',options:compBranchListRemaining}"
                        name="voice"
                        multiple,
                    )
                    text-info.settings-list__text-info Вы можете назначить сотрудника в один или несколько отделов. Чтобы выбрать отдел, начните набирать его название в данном поле.

                li.settings-list__item(v-if="$store.getters['user/isRole'](['admin','owner'])")
                    h3.settings-list__name Настройки каналов
                    ul.settings-list__sub
                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(name="is_common_chat" v-model="model.is_common_chat") Подключиться к общему чату
                            text-info.settings-list__text-info.settings-list__text-info_sub Если включена данная функция, Вы сможете общаться со своей командой в общем чате.

                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(name="use_calls" v-model="model.use_calls") Принимать звонки от клиентов

                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(name="use_chat" v-model="model.use_chat") Принимать чаты от клиентов

                        li.settings-list__sub-item(v-if="0")
                            base-radio-check.settings-list__control( name="notifications") Принимать чаты от клиентов из ВКонтакте

                        li.settings-list__sub-item(v-if="0")
                            base-radio-check.settings-list__control( name="notifications") Принимать чаты от клиентов из FaceBook

                        li.settings-list__sub-item(v-if="0")
                            base-radio-check.settings-list__control( name="notifications") Принимать звонки от клиентов

                        li.settings-list__sub-item(v-if="0")
                            base-radio-check.settings-list__control( name="notifications") Принимать звонки от клиентов

                        li.settings-list__sub-item(v-if="0")
                            base-radio-check.settings-list__control( name="notifications") Принимать звонки от клиентов
                            text-info.settings-list__text-info Выберите, в каких каналах данный сотрудник может общаться с клиентами.


                li.settings-list__item(v-if="anotherProfile && $store.getters['user/isRole'](['admin','owner'])")
                    h3.settings-list__name Настройки доступа
                    ul.settings-list__sub
                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(
                            :disabled="adminMode"
                            name="operatorSeniorMode"
                            v-model="operatorSeniorMode",

                            ) Включить права старшего специалиста
                        li.settings-list__sub-item
                            base-radio-check.settings-list__control(
                                :disabled="operatorSeniorMode"
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
//import TelInput from '@/components/TelInput'

import browserNotification from '@/modules/browserNotification'

const TelInput = () => import('@/components/TelInput')

export default {
    components: {
        TextInfo,
        UploadAvatar,
        PasswordRefresh,
        TelInput
    },

    data() {
        return {
            isAddOperator: !!this.$route.query.add,
            phoneUnmaskedValue: '',
            phonesTypeSelect: {},
            phonesType: [
                {
                    name: 'Телефон',
                    value: 0
                },
                {
                    name: 'Sip',
                    value: 1
                }
            ],
            model: {
                pass: '', //нужен для создания нового оператора
                user_id: null,
                owner_id: null, //нужен для проверки userIdNoOwner()
                avatar: null,
                first_name: null,
                last_name: null,
                phone: null,
                phones: {
                    type: 0,
                    phone: '',
                    sip: ''
                },
                mail: null,
                role_id: null,
                is_common_chat: null,
                branches_ids: [],
                use_chat: null,
                use_calls: null
            },
            operatorSeniorMode: false,
            adminMode: false,
            branchListSelected: [],
            branchListAll: []
        }
    },

    computed: {
        compBranchListAll() {
            return this.$store.getters['user/branchListAll']
        },
        branches_ids() {
            return this.model.branches_ids
        },
        profile() {
            return this.$store.state.user.profile
        },
        myRoles() {
            return this.$store.getters['user/roles']
        },
        anotherProfile() {
            return this.model.user_id !== this.profile.user_id
        },
        compBranchListRemaining() {
            let list = this.branches_ids
            return this.branchListAll.filter(item => {
                return !list.includes(item.id)
            })
        }
    },
    watch: {
        profile: {
            handler(val) {
                if (val) {
                    this.getProfileByUserId()
                }
            },
            deep: true,
            immediate: true
        },
        compBranchListAll(val) {
            this.branchListAll = val
        },
        phonesTypeSelect(val) {
            this.model.phones.type = val.value
        },
        branchListSelected(val) {
            this.model.branches_ids = val.map(item => {
                return item.id
            })
        },
        operatorSeniorMode(val) {
            if (val) {
                this.model.role_id = 14
            } else this.model.role_id = 6
        },
        adminMode(val) {
            if (val) {
                this.model.role_id = 13
            } else this.model.role_id = 6
        }
    },
    created() {
        //this.clearFormValue();
    },
    methods: {
        setBranchListSelected(val) {
            if (val) {
                this.branchListAll = val
                this.branchListSelected = val.filter(item => {
                    return this.model.branches_ids.includes(item.id)
                })
            }
        },
        getBranchListAll() {
            if (this.$store.getters['user/branchListAll'].length) {
                this.setBranchListSelected(this.$store.getters['user/branchListAll'])
            } else {
                this.$store.watch(
                    state => state.user.branchListAll,
                    val => {
                        return this.setBranchListSelected(val)
                    }
                )
            }
        },
        fillProfile() {
            ;(this.model.user_id = this.profile.user_id),
                (this.model.owner_id = this.profile.owner_id), //нужен для проверки userIdNoOwner()
                (this.model.avatar = this.profile.avatar),
                (this.model.first_name = this.profile.first_name),
                (this.model.last_name = this.profile.last_name),
                (this.model.phone = this.profile.phone),
                (this.model.phones = this.profile.phones),
                (this.model.mail = this.profile.mail),
                (this.model.role_id = this.profile.role_id),
                (this.model.is_common_chat = this.profile.is_common_chat),
                (this.model.branches_ids = this.profile.branches_ids),
                (this.model.use_chat = this.profile.use_chat),
                (this.model.use_calls = this.profile.use_calls)

            this.adminMode = this.profile.role_id === 13
            this.operatorSeniorMode = this.profile.role_id === 14
            this.phoneUnmaskedValue = this.profile.phones.phone
            this.getBranchListAll()
        },
        setPassword(val) {
            this.model.pass = val
        },
        clearFormValue() {
            if (!this.isAddOperator) return
            for (let prop in this.model) {
                if (prop == 'phones') {
                    this.model[prop].phone = ''
                    this.model[prop].additional = ''
                    this.model[prop].sip = ''
                } else this.model[prop] = ''

                this.role_id = 6
            }
        },
        getProfileByUserId() {
            if (this.isAddOperator) {
                this.getBranchListAll()
                return
            }

            let user_id = +this.$route.query.user_id
            if (user_id) {
                if (user_id == this.profile.user_id) return this.fillProfile()

                this.$http
                    .get('user/get-profile', { params: { user_id: user_id } })
                    .then(({ data }) => {
                        if (data.success) {
                            this.model = data.data.user
                            this.adminMode = this.model.role_id === 13
                            this.operatorSeniorMode = this.model.role_id === 14
                            this.phoneUnmaskedValue = this.model.phones.phone
                            this.getBranchListAll()
                        }
                    })
                    .catch(errors => {
                        if (errors.response.status == 404) this.$router.push({ name: 'process' })
                    })
            } else {
                this.fillProfile()
            }
        },
        unmaskedvalue(val) {
            this.phoneUnmaskedValue = val
        },
        getUploadAvatar(event) {
            this.model.avatar = event
        },
        createOperator() {
            this.$http.post('employees', this.model).then(({ data }) => {
                browserNotification('Оператор создан')
                this.$router.push({ name: 'team' })
            })
        },
        userUpdate() {
            this.$validator.validateAll().then(response => {
                if (response) {
                    this.model.phones.phone = this.phoneUnmaskedValue

                    if (this.isAddOperator) {
                        return this.createOperator()
                    }

                    this.$http
                        .post('user/update-profile', this.model)
                        .then(({ data }) => {
                            if (data.data.id === this.profile.id)
                                this.$store.commit('user/profileUpdate', data.data)
                            browserNotification('Сохранено')
                            this.$router.push({ name: 'team' })
                        })
                        .catch(({ response }) => {
                            if (response.data.errors) {
                                // добавляет ошибки с бека в валидатор
                                for (let prop in response.data.errors) {
                                    let id = this.$validator.fields.find({ name: prop })
                                    let err = {
                                        field: prop,
                                        msg: response.data.errors[prop].message,
                                        id: id
                                    }
                                    this.errors.add(err)
                                    this.$validator.flag(prop, {
                                        valid: false,
                                        dirty: true
                                    })
                                }
                            }
                        })
                }
            })
        }
    }
}
</script>
