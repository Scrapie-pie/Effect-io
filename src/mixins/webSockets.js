import config from '@/config/index'

import { dialogPush } from '@/modules/modules'
import browserNotification from '@/modules/browserNotification'
import { browserNotificationMessage } from '@/modules/browserNotification'

import settings from '@/routes/settings'

import lodash_once from 'lodash/once'
import { httpParams, viewModeChat } from '@/mixins/mixins'

export default {
    mixins: [httpParams, viewModeChat], //routerPushProcessAllOrItemFirst подключи будет баг

    computed: {
        userId() {
            return this.$store.state.user.profile.id
        }
    },
    watch: {
        /*    userId(val){
            if(val) this.webSocketInit()
            else this.$socket.disconnect()
        }*/
    },
    methods: {
        messageStatusActive(message) {
            if (message.status === 'active') {
                if (message.from_role_id != 9) this.playSoundFile('sound_new_guest_message')

                this.$store.commit('visitors/selfMessageLastUpdate', message)

                this.$store.commit('user/unreadUpdateGuest', message.active_unread_rooms)

				console.log(this.$route.name==='chatId')



                browserNotificationMessage.call(this,message).then(click => {
                    if (click === 'toLink') {
                        let { guest_uuid, site_id } = message
                        this.$router.push({ name: 'chatId', params: { guest_uuid, site_id } })
                    }
                })
            }
        },
        /*      routerPushProcessAllOrItemFirst(){
            console.log('routerPushProcess');
            let itemList = this.$store.state.visitors.process;
            if(!itemList.length) this.$router.push({name:'processAll'}); //Todo проверить доделать этот варивант
            else {
                console.log(!itemList.length,itemList,itemList.length,itemList[0]);
                let {guest_uuid,site_id} = itemList[0];
                this.$router.push({name:'process',params: { guest_uuid,site_id}});
            }
        },*/
        playSoundFile(nameFile) {
            let { settings, sounds } = this.$store.state.user.settings

            let index = settings[nameFile]
            /*  console.log(sounds[index].file);
            console.log(nameFile,config.api_server.split('/app')[0] + sounds[index].file);
            console.log(config.api_server);
            console.log(index,sounds[index].file);*/
            if (!sounds[index].file) return

            let audio = new Audio(sounds[index].file)
            audio.volume = 0.5
            audio.play()
        },
        webSocketInit() {
            console.log('webSocketInit', this.userId)
            //this.$socket.disconnect();

            return
            /*eslint-disable */
			try {
				let socket = io(config.api_websocket, {
					query: {
						uuid: this.userId
					}
				})

				socket.on('connect', () => {
					return console.log('connected')
				})

				socket.on('connect_error', () => {
					return console.log('connect_error')
				})

				socket.on('connect_timeout', () => {
					return console.log('connect_timeout')
				})

				socket.on('update-branches', function(payload) {
					return console.log('update-branches', payload)
				})

				socket.on('update-employees', function(payload) {
					return console.log('update-employees', payload)
				})

				socket.on('employee-online', function(payload) {
					return console.log('employee-online', payload)
				})

				socket.on('new-message', function(payload) {
					return console.log('new-message', payload)
				})
			} catch (err) {
				return browserNotification('Сбой на сервере сокетов')
			}
			/*eslint-enabled */
		}
	},
	sockets: {
		connect() {
			console.log('socket connected...')
		},

		'hot-guest'(val) {
            this.$socket.io.emit('delivered', val.socket_id);
			console.log('hot-guest', val)
			this.$store.commit('visitors/messageHot', { val, set: true })
		},
		'typing-live'(val) {
            this.$socket.io.emit('delivered', val.socket_id);
			console.log('typing-live', val)

			this.$store.commit('roomActive/typingLive', val)
		},
		'new-message'(val) {
            this.$socket.io.emit('delivered', val.socket_id);
			//переместил сюда, что бы список на странице team обновлялся

			if (['search'].includes(this.viewModeChat)) return //Чтобы на странице поиска не приходили сообщения....

			console.log('sockets new-message', val)
			val.socket = true //Todo Временное решение, на проверку дубликатов, пока Симон не исправит

			if (val.from_role_id != 8 && val.from_role_id != 9) {
				val.guest_uuid = val.guest_uuid
				this.$store.commit('visitors/messageHot', { val, set: false })
			}

			if (val.site_id && val.room_id === this.$store.state.roomActive.id) {
				// если есть val.site_id значит общение в диалогах
				console.log('// Нужно, что бы чужое сообщение оказалось каждое в своем чате')
				this.$root.$emit('messageAdd', val) // Нужно, что бы чужое сообщение оказалось каждое в своем чате
			}

			if (
				this.viewModeChat === 'operators' && //иначе на других страницах this.httpParams.params.id вылетала ошибка
				!val.site_id &&
				val.from_user_info.user_id == this.httpParams.params.id
			) {
				console.log('//иначе на других страницах this.httpParams.params.id вылетала ошибка')
				this.$root.$emit('messageAdd', val)
			}

			if (val.status === 'unprocessed') {
				return this.$store.commit('visitors/processMessageLastUpdate', val)
			}

			if (val.status === 'supervisor') {
				return
			}

			if (val.site_id) {
				console.log(val.site_id)
				if (this.httpParams) {
					let { guest_uuid, site_id } = this.httpParams.params
					if (val.from_user_info.guest_uuid + val.site_id === guest_uuid + site_id) {
						//Если это сообщение посетителя в чате то нужно очистить TypingLive
						this.$store.commit('roomActive/typingLive', {
							message: '',
							guest_uuid,
							site_id
						})
					}
				}
                this.messageStatusActive(val)

			} else {
				console.log(
					val.room_id,
					this.$store.state.user.profile.common_room_id,
					this.$store.state.roomActive.id
				)
				if (val.room_id === this.$store.state.user.profile.common_room_id) {
					this.$store.commit('user/unreadUpdate', ['common', 1])
					this.playSoundFile('sound_new_common_message')
					if (this.$store.state.roomActive.id === val.room_id)
						this.$root.$emit('messageAdd', val)
					return
				}

				this.$store.commit('operators/messageLastUpdate', val)
				this.$store.commit('user/unreadUpdate', ['private', 1])

				this.playSoundFile('sound_new_operator_message')
				browserNotificationMessage.call(this,val).then(click => {
					if (click === 'toLink') {
						let find = this.$store.getters['operators/all'].find(
							item => item.employee_id === val.from_user_info.id
						)
						this.$router.push({ name: 'teamChat', params: { id: find.id } })
					}
				})
			}
		},

		disconnect() {
			console.log('socket disconnect')
		},
		'guest-new-session'(val) {
            this.$socket.io.emit('delivered', val.socket_id);
			//console.log('guest-new-session',val);
			this.playSoundFile('sound_new_guest')
			this.$root.$emit('guestNewSession', val)
		},
		'update-guest-employee'(val) {
            this.$socket.io.emit('delivered', val.socket_id);
			console.log('update-guest-employee', val)
			this.$root.$emit('guestUpdate', val)
		},
		'guest-update'(val) {
            this.$socket.io.emit('delivered', val.socket_id);
			//Todo 'guest-update'
			console.log('guest-update', val)

			//this.$root.$emit('guestUpdate',val)

			if (!this.httpParams) return
			let { site_id, guest_uuid } = this.httpParams.params

			let updateNameItem = listName => {
				let itemList = this.$store.state.visitors[listName]

				let findIndex = itemList.findIndex(
					item => item.guest_uuid + item.site_id === val.guest_uuid + val.site_id
				)

				if (findIndex !== -1) {
					this.$set(itemList[findIndex], 'name', val.name)
				}

				this.$store.commit('visitors/newList', { field: listName, val: { list: itemList } })
			}

			updateNameItem('self')
			updateNameItem('process')

			if (val.guest_uuid + val.site_id === guest_uuid + site_id) {
				this.$store.commit('visitors/itemOpen', val) //{name,guest_uuid,site_id} = val
			}
		},
		'message-delivered'(val) {
            this.$socket.io.emit('delivered', val.socket_id);
			this.$root.$emit('messageDelivered', val)
		},
		'update-branches'({list,socket_id}) {
            this.$socket.io.emit('delivered', socket_id);
			console.log('update-branches', list)
			this.$store.commit('user/branchListAll', list)
		},
		'room-users'(val) {
            console.log('room-users',val);
            this.$socket.io.emit('delivered', val.socket_id);
			//console.log('room-users', val)
			val.socket = true // для того что бы room_id не обновлять
			this.$store.commit('roomActive/set', val.list)
		},
		unprocessed(val) {
            this.$socket.io.emit('delivered', val.socket_id);
			console.log('unprocessed', val)
        /*    val = {"status":"unprocessed","room_id":1660,"guest_uuid":"2a04bb13-7130-5bc6-8c29-f419b1f74697","site_id":118,"uuid":"2a04bb13-7130-5bc6-8c29-f419b1f74697","photo":null,"photo_stub":12,"gender":null,"name":"Гость","mail":null,"phone":null,"role_id":8,"created":1573443130,"modified":1573443130,"language":"ru","country_id":"RU","region_id":14,"city_id":30,"ip":"185.6.216.65","timezone":"Europe/Moscow","browser":"Chrome","os":"Windows 10","device":"pc","channel_type":7,"channel_user_id":"2a04bb13-7130-5bc6-8c29-f419b1f74697","regRuLogin":null,"country":"Россия","region":"Воронежская область","city":"Воронеж","referrer":"http://localhost:4001/","key_phrases":"","visits_count":2,"page":"effect-widget (http://mishki.ucoz.net/)","session_start_time":1573471957,"online":1,"channel_link":"mishki.ucoz.net","comment":null,"additional_contact_1":null,"additional_contact_2":null,"additional_contact_3":null,"online_time":"36 мин. 48 сек.","contact_info":{"uuid":"2a04bb13-7130-5bc6-8c29-f419b1f74697","photo":null,"photo_stub":12,"gender":null,"name":"Гость","mail":null,"phone":null,"role_id":8,"created":1573443130,"modified":1573443130,"language":"ru","country_id":"RU","region_id":14,"city_id":30,"ip":"185.6.216.65","timezone":"Europe/Moscow","browser":"Chrome","os":"Windows 10","device":"pc","channel_type":7,"channel_user_id":"2a04bb13-7130-5bc6-8c29-f419b1f74697","regRuLogin":null,"guest_uuid":"2a04bb13-7130-5bc6-8c29-f419b1f74697","site_id":118,"country":"Россия","region":"Воронежская область","city":"Воронеж","referrer":"http://localhost:4001/","key_phrases":"","visits_count":2,"page":"effect-widget (http://mishki.ucoz.net/)","session_start_time":1573471957,"online":1,"channel_link":"mishki.ucoz.net","comment":null,"additional_contact_1":null,"additional_contact_2":null,"additional_contact_3":null,"online_time":"36 мин. 48 сек."},"from_user_info":{"name":"","photo":null},"body":"qwe","last_message_time":1573474165,"from_role_id":8,"withBrowserNotification":118,"common_count":"1","unread":[],"last_message":"Автоматическое сообщение отправлено клиенту: \"Здравствуйте.\"","last_message_author":"Система","hot":true,"awaiting_answer_timeFormat":1573474167.667}
            val.guest_uuid = Math.random()
            setInterval(()=>{
                val.guest_uuid = Math.random()
                if (val.status === 'recipient' || val.status === 'invited' || val.status === 'unprocessed') {
                    this.$store.commit('visitors/processMessageLastUpdate', val)
                    this.$store.commit('user/unreadUpdate', ['unprocessed', 1])

                    //this.$store.commit('user/unreadUpdateUnprocessed', val.common_count)
                    this.playSoundFile('sound_new_guest')
                    browserNotificationMessage.call(this,val).then(click => {
                        if (click === 'toLink') {
                            let { guest_uuid, site_id } = val
                            this.$router.push({ name: 'process', params: { guest_uuid, site_id } })
                        }
                    })
                }
            },100)*/
            if (val.status === 'recipient' || val.status === 'invited' || val.status === 'unprocessed') {
                this.$store.commit('visitors/processMessageLastUpdate', val)
                this.$store.commit('user/unreadUpdate', ['unprocessed', 1])

                //this.$store.commit('user/unreadUpdateUnprocessed', val.common_count)
                this.playSoundFile('sound_new_guest')
                browserNotificationMessage.call(this,val).then(click => {
                    if (click === 'toLink') {
                        let { guest_uuid, site_id } = val
                        this.$router.push({ name: 'process', params: { guest_uuid, site_id } })
                    }
                })
            }



		},
		'auto-attach'(val) {
            this.$socket.io.emit('delivered', val.socket_id);
			console.log('auto-attach', val)

			if (val.code === this.$store.state.user.profile.code)
				this.$store.commit('user/profileUpdate', { code: null })

			this.playSoundFile('sound_new_guest_message')

			val.awaiting_answer_timeFormat = new Date().getTime() / 1000 - val.awaiting_answer_time
			dialogPush(this, 'self', val)
            //this.$store.commit('user/socketUnreadUpdate', ['guest', val])
            //this.$store.commit('user/unreadUpdate', ['guest', 1])
			//this.$store.commit('user/unreadUpdate',['guest',1]);

			browserNotificationMessage.call(this,val).then(click => {
				if (click === 'toLink') {
					let { guest_uuid, site_id } = val
					this.$router.push({ name: 'chatId', params: { guest_uuid, site_id } })
				}
			})
		},
		'self-remove'(val) {
            this.$socket.io.emit('delivered', val.socket_id);
			console.log('self-remove', val, val.room_id, this.$store.state.roomActive.id)

			//if(val.room_id === this.$store.state.roomActiveId) return

			this.$store.dispatch('setMessageRead', {
				guest_uuid: val.guest_uuid,
				site_id: val.site_id,
				type: 'visitors'
			})
			this.$store.commit('visitors/selfMessageRemoveItem', val)


			if (this.viewModeChat === 'visitors') this.$router.push({ name: 'messageAll' })
		},
		'unprocessed-remove'(val) {
            this.$socket.io.emit('delivered', val.socket_id);
			console.log('unprocessed-remove', val, val.room_id, this.$store.state.roomActive.id)
			//if(val.room_id === this.$store.state.roomActiveId) return

			this.$store.commit('visitors/processRemoveItem', val)
			this.$store.commit('user/unreadUpdate', ['unprocessed', -1])

			if (this.viewModeChat === 'process') this.routerPushProcessAllOrItemFirst()
		},
		'update-employees'({socket_id,list}) {
            this.$socket.io.emit('delivered', socket_id);
            console.log('update-employees');
            this.$store.commit('operators/all', list)
			let find = list.find(item => item.id === this.$store.state.user.profile.id)
			if (find) {
				if (!find.is_common_chat && this.viewModeChat === 'common')
					this.$router.push({ name: 'processAll' })

				this.$store.commit('user/profileUpdate', find)
				if (
					!this.$store.getters['user/isRole'](['admin', 'owner', 'operatorSenior']) &&
					this.$route.path.includes('service')
				) {
					this.$router.push({ name: 'processAll' })
				}
			}
		},
        'employee-online'(val) {
            console.log(this.$socket);
            this.$socket.io.emit('delivered', val.socket_id);
            console.log('employee-online',val);
            let {user_id,online} = val
            console.log('employee-online');
            this.$store.commit('operators/setOperatorOnline', {user_id,online})
            if(user_id===this.$store.state.user.profile.id) this.$store.commit('user/profileUpdate', {online})

        }
	}
}
