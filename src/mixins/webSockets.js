import config from '@/config/index'
import io from 'socket.io-client'

import { dialogPush } from '@/modules/modules'
import browserNotification from '@/modules/browserNotification'
import { browserNotificationMessage } from '@/modules/browserNotification'

import settings from '@/routes/settings'

import lodash_once from 'lodash/once'
import { httpParams, viewModeChat } from '@/mixins/mixins'

export default {
    mixins: [httpParams, viewModeChat], //routerPushProcessAllOrItemFirst подключи будет баг
    data() {
        return {

            flag:false,
        }
    },
    computed: {
        profile() {
            return this.$store.state?.user?.profile
        }
    },
    watch: {

        profile: 'webSocketInit'

        /*    userId(val){
            if(val) this.webSocketInit()
            else this.$socket.disconnect()
        }*/
    },
    methods: {
        socketEmitListEvents(OnOrOff) {
            for (let key in this.$store.state.sockets.emitList) {
                let method = this.$store.state.sockets.emitList[key]
                console.log('socketEmitListEvents',this.$store.state.sockets.emitList[key],key);
                this.$root[OnOrOff](this.$store.state.sockets.emitList[key], this[key])
            }
        },
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
        webSocketInit({uuid,owner_id,socket_server}) {
            if (!uuid) return
            console.log('webSocketInit', uuid)




			try {
                const socket = io.connect(socket_server, {
                    autoConnect: true,
                    reconnection: true,
                    reconnectionAttempts: 30,
                    reconnectionDelay: 3000,
                    transports: ['websocket','polling'],
                    upgrade: false,
                    secure: true,
                    query: {
                        uuid: uuid,
                        user: 'employee',
                        socketGroupId: owner_id
                    }
                })

                for (let key in this.$store.state.sockets.emitList) {

                    socket.on(key, socketValue =>{
                            this.flag = !this.flag //Todo убрать принятие через раз после теста
                            if(!this.flag)  return
                            this.$root.$emit(this.$store.state.sockets.emitList[key], socketValue)
                        }

                    )
                }



			} catch (err) {
				return browserNotification('Сбой на сервере сокетов')
			}
			/*eslint-enabled */
		},


		'hot-guest'(val) {
			//this.$socket.emit('delivered', val.socket_id);
			console.log('hot-guest', val)
			this.$store.commit('visitors/messageHot', { val, set: true })

            this.$store.commit('sockets/historyPush', {
                event: 'hot-guest',
                socket_id: val.socket_id
            })
		},
		'new-message'(val) {

            this.$store.commit('sockets/historyPush', {
                event: 'new-message',
                socket_id: val.socket_id
            })
			//this.$socket.emit('delivered', val.socket_id);
			//переместил сюда, что бы список на странице team обновлялся

			//f (['search'].includes(this.viewModeChat)) return //Чтобы на странице поиска не приходили сообщения....

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
		'guest-new-session'(val) {
			//this.$socket.emit('delivered', val.socket_id);
			//console.log('guest-new-session',val);
			this.playSoundFile('sound_new_guest')
			this.$root.$emit('guestNewSession', val)

            this.$store.commit('sockets/historyPush', {
                event: 'guest-new-session',
                socket_id: val.socket_id
            })
		},
		'update-guest-employee'(val) {
			//this.$socket.emit('delivered', val.socket_id);
			console.log('update-guest-employee', val)
			this.$root.$emit('guestUpdate', val)

            this.$store.commit('sockets/historyPush', {
                event: 'update-guest-employee',
                socket_id: val.socket_id
            })
		},
		'guest-update'(val) {
            this.$store.commit('sockets/historyPush', {
                event: 'guest-update',
                socket_id: val.socket_id
            })
			//this.$socket.emit('delivered', val.socket_id);
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
			//this.$socket.emit('delivered', val.socket_id);
			this.$root.$emit('messageDelivered', val)

            this.$store.commit('sockets/historyPush', {
                event: 'message-delivered',
                socket_id: val.socket_id
            })
		},
		'update-branches'({list,socket_id}) {
			//this.$socket.emit('delivered', socket_id);
			console.log('update-branches', list)
			this.$store.commit('user/branchListAll', list)

            this.$store.commit('sockets/historyPush', {
                event: 'update-branches',
                socket_id: socket_id
            })
		},
		'room-users'(val) {
			console.table('room-users',val.list);
			//this.$socket.emit('delivered', val.socket_id);
			//console.log('room-users', val)
			val.socket = true // для того что бы room_id не обновлять
			this.$store.commit('roomActive/set', val.list)

            this.$store.commit('sockets/historyPush', {
                event: 'room-users',
                socket_id: val.socket_id
            })
		},
		'unprocessed'(val) {
            this.$store.commit('sockets/historyPush', {
                event: 'unprocessed',
                socket_id: val.socket_id
            })

            //this.$socket.emit('delivered', val.socket_id);
			console.log('unprocessed', val)

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
            this.$store.commit('sockets/historyPush', {
                event: 'auto-attach',
                socket_id: val.socket_id
            })
			//this.$socket.emit('delivered', val.socket_id);
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
            this.$store.commit('sockets/historyPush', {
                event: 'self-remove',
                socket_id: val.socket_id
            })
			//this.$socket.emit('delivered', val.socket_id);
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
            this.$store.commit('sockets/historyPush', {
                event: 'unprocessed-remove',
                socket_id: val.socket_id
            })
			//this.$socket.emit('delivered', val.socket_id);
			console.log('unprocessed-remove', val, val.room_id, this.$store.state.roomActive.id)
			//if(val.room_id === this.$store.state.roomActiveId) return

			this.$store.commit('visitors/processRemoveItem', val)
			this.$store.commit('user/unreadUpdate', ['unprocessed', -1])

			if (this.viewModeChat === 'process') this.routerPushProcessAllOrItemFirst()


		},
		'update-employees'({socket_id}) {
            this.$store.commit('sockets/historyPush', {
                event: 'update-employees',
                socket_id: socket_id
            })
			//this.$socket.emit('delivered', socket_id);
			console.log('update-employees');
			this.$store.dispatch('operators/getAll').then(()=>{

				let list = this.$store.getters['operators/all']
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
			})



		},
		'employee-online'(val) {
            this.$store.commit('sockets/historyPush', {
                event: 'employee-online',
                socket_id: val.socket_id
            })
			console.log(this.$socket);
			//this.$socket.emit('delivered', val.socket_id);
			console.log('employee-online',val);
			let {user_id,online} = val
			console.log('employee-online');
			this.$store.commit('operators/setOperatorOnline', {user_id,online})
			if(user_id===this.$store.state.user.profile.id) this.$store.commit('user/profileUpdate', {online})



		}
	},
	sockets: {
		connect() {
			console.log('socket connected...')
		},

		'hot-guest'(val) {
			this['hot-guest'](val)
		},
		'typing-live'(val) {
            //this.$socket.emit('delivered', val.socket_id);
			console.log('typing-live', val)

			this.$store.commit('roomActive/typingLive', val)
		},
		'new-message'(val){
			this['new-message']	(val)
		},

		disconnect() {
			console.log('socket disconnect')
		},
		'guest-new-session'(val) {
			this['guest-new-session'](val)
		},
		'update-guest-employee'(val) {
			this['update-guest-employee'](val)
		},
		'guest-update'(val) {
			this['guest-update'](val)
		},
		'message-delivered'(val) {
            this['message-delivered'](val)
		},
		'update-branches'(val) {
            this['update-branches'](val)
		},
		'room-users'(val) {
            this['room-users'](val)
		},
		'unprocessed'(val) {
           this['unprocessed'](val)


		},
		'auto-attach'(val) {
           this['auto-attach'](val)
		},
		'self-remove'(val) {
            this['self-remove'](val)
		},
		'unprocessed-remove'(val) {
            this['unprocessed-remove'](val)
		},
		'update-employees'(val) {
            this['update-employees'](val)

		},
        'employee-online'(val) {
            this['employee-online'](val)

        }
	},
    created() {
        this.socketEmitListEvents('$on')
    },
    beforeDestroy() {
        this.socketEmitListEvents('$off')
    },
}
