<template lang="pug">
    section
        base-wait(name="pageSettingsApp")
        form(@submit.prevent="submit")
            ul.settings-list
                li.settings-list__item
                    h3.settings-list__name Уведомления
                    base-radio-check.settings-list__control(name="push_notifications" v-model="model.push_notifications", @click="notificationsEnable") Включить браузерные уведомления
                    text-info.settings-list__text-info Вы будете получать уведомления о важных событиях в виде стандартного уведомления браузера, даже если он будет свернут.

                li.settings-list__item
                    h3.settings-list__name Звук при новом сообщении от посетителя
                    base-field.settings-list__control.settings-list__select(
                        type="select",
                        :selectOptions="{value:model.sound_new_guest_message,label:'name',options:sounds}"
                        v-model="model.sound_new_guest_message"
                        name="sound_new_guest_message"
                    )
                    text-info.settings-list__text-info Выберите звук, который будет проигрываться, если в Ваших текущих диалогах посетитель напишет новое сообщение.

                li.settings-list__item
                    h3.settings-list__name Звук, когда новый посетитель зашел на сайт
                    base-field.settings-list__control.settings-list__select(
                        type="select",
                        :selectOptions="{value:model.sound_new_guest,label:'name',options:sounds}"
                        name="sound_new_guest"
                        v-model="model.sound_new_guest"
                    )
                    text-info.settings-list__text-info Выберите звук, который будет проигрываться, если новый посетитель зайдет на сайт. Вы сможете начать с ним диалог.

                li.settings-list__item
                    h3.settings-list__name Звук, когда другой сотрудник написал Вам новое сообщение
                    base-field.settings-list__control.settings-list__select(
                        type="select",
                        :selectOptions="{value:model.sound_new_operator_message,label:'name',options:sounds}"
                        name="sound_new_operator_message"
                        v-model="model.sound_new_operator_message"
                    )
                    text-info.settings-list__text-info Выберите звук, который будет проигрываться, если кто-то из Вашей команды напишет Вам новое сообщение.

                li.settings-list__item
                    h3.settings-list__name Звук, когда есть новое сообщение в общем чате
                    base-field.settings-list__control.settings-list__select(
                        type="select",
                        :selectOptions="{value:model.sound_new_common_message,label:'name',options:sounds}"
                        name="sound_new_common_message"
                        v-model="model.sound_new_common_message"
                    )
                    text-info.settings-list__text-info Выберите звук, который будет проигрываться, если кто-то из Вашей команды напишет в общем чате, упомянув Вас.

                li.settings-list__item
                    h3.settings-list__name Язык приложения
                    base-field.settings-list__control.settings-list__select(
                        type="select",
                        :selectOptions="{value:model.language,label:'name',options:languages}"
                        name="voice"
                        v-model="model.language"
                        )
                li.settings-list__item
                    base-btn(type="submit") Сохранить

</template>

<script>
import TextInfo from '@/components/TextInfo'
import browserNotification from '@/modules/browserNotification'

export default {
    components: {
        TextInfo
    },
    data() {
        return {
            model: {
                push_notifications: '',
                sound_new_common_message: {},
                sound_new_guest: {},
                sound_new_guest_message: {},
                sound_new_operator_message: {},
                language: ''
            },
            languages: [],
            sounds: []
        }
    },
    computed: {
        settings() {
            return this.$store.getters['user/settings']
        }
    },
    watch: {
        'model.sound_new_common_message': 'playSoundFile',
        'model.sound_new_guest': 'playSoundFile',
        'model.sound_new_guest_message': 'playSoundFile',
        'model.sound_new_operator_message': 'playSoundFile',
        settings: {
            handler(val) {
                if (val) {
                    let sounds = val.sounds.map((elem, index) => {
                        elem.index = index
                        return elem
                    })
                    this.sounds = sounds
                    this.model.push_notifications = val.settings.push_notifications
                    this.model.sound_new_common_message =
                        sounds[val.settings.sound_new_common_message] // = object
                    this.model.sound_new_guest = sounds[val.settings.sound_new_guest]
                    this.model.sound_new_guest_message =
                        sounds[val.settings.sound_new_guest_message]
                    this.model.sound_new_operator_message =
                        sounds[val.settings.sound_new_operator_message]

                    //val.languages = {ru:"Русский",us:"Английский"}

                    let languages = []
                    for (let prop in val.languages) {
                        languages.push({
                            prefix: prop,
                            name: val.languages[prop]
                        })
                    }
                    this.languages = languages

                    this.model.language = {
                        prefix: val.settings.language,
                        name: val.languages[val.settings.language]
                    }
                }
            },
            immediate: true
        }
    },
    created() {},
    methods: {
        notificationsEnable() {
            if (this.model.push_notifications) return // Когда мы кликаем значение еще старое, по этому я инвертирую проверку

            Notification.requestPermission(permission => {
                if (permission === 'denied') {
                    this.$root.$emit(
                        'popup-notice',
                        'Вы запретили уведомления, их можно разрешить в настройках вашего браузера'
                    )
                    this.model.push_notifications = 0
                }

                if (permission === 'granted') {
                    browserNotification(
                        'Уведомления включены',
                        'Таким образом мы будем Вас уведомлять'
                    )
                }
            })
        },
        submit() {
            let data = {
                push_notifications: this.model.push_notifications,
                sound_new_common_message: this.model.sound_new_common_message.index,
                sound_new_guest: this.model.sound_new_guest.index,
                sound_new_guest_message: this.model.sound_new_guest_message.index,
                sound_new_operator_message: this.model.sound_new_operator_message.index,
                language: this.model.language.prefix
            }

            this.$http.put('company/settings-update', data).then(() => {
                browserNotification('Сохранено')
                this.$store.commit('user/settingsUpdate', data)
                this.$router.push({ name: 'team' })
            })
        },
        playSoundFile: function(sound, prev_sound) {
            if (!prev_sound.name) return //Что бы не проигрывалось при заходе на страницу
            if (sound.file) {
                let audio = new Audio(sound.file)
                audio.volume = 0.25
                audio.play()
            }
        }
    }
}
</script>
