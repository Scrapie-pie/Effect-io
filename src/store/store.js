import Vue from 'vue'
import Vuex from 'vuex'

import user from '@/store/user'
import phrases from '@/store/phrases'
import tags from '@/store/tags'
import operators from '@/store/operators'
import visitors from '@/store/visitors'
import roomActive from '@/store/roomActive'

Vue.use(Vuex)

const getDefaultStateRoom = () => {
    return {

    }
}

const getDefaultState = () => {
    return Object.assign(
        {
            loading: false,

            connected: false,
            channelList: [
                { id: null, name: 'Все каналы' },
                { id: 7, name: 'Виджеты' },
                { id: 2, name: 'ВКонтакте' },
                { id: 3, name: 'Facebook' },
                { id: 5, name: 'Telegram' },
                { id: 6, name: 'Viber' },
                { id: 13, name: 'WhatsApp' },
                { id: 4, name: 'Slack' }
            ],
            filterSelect: {
                url: [],
                calendar: {},
                last_days: ''
            }
        },
        getDefaultStateRoom()
    )
}
// initial state
const state = getDefaultState()

export default new Vuex.Store({
    modules: {
        user,
        phrases,
        tags,
        operators,
        visitors,
        roomActive
    },
    state,

    mutations: {
        SOCKET_CONNECT(state, val) {
            console.log('SOCKET_CONNECT', val)
        },

        SOCKET_ERROR(state, val) {
            console.log('SOCKET_ERROR', val)
        },
        SOCKET_DISCONNECT(state, val) {
            console.log('SOCKET_DISCONNECT', val)
        },
        SOCKET_RECONNECT(state, val) {
            console.log('SOCKET_RECONNECT', val)
        },
        SOCKET_RECONNECT_ERROR(state, val) {
            console.log('SOCKET_RECONNECT', val)
        },
        SOCKET_RECONNECT_ATTEMPT(state, val) {
            console.log('SOCKET_RECONNECT_ATTEMPT', val)
        },
        SOCKET_CONNECT_ERROR(state, val) {
            console.log('SOCKET_CONNECT_ERROR', val)
        },
        resetState(state) {
            Object.assign(state, getDefaultState())
        },

        loading(state, val) {
            state.loading = val
        },
        setFilter(state, object) {
            for (let key in object) {
                this._vm.$set(state.filterSelect, key, object[key])
            }
            localStorage.setItem('filterSelect', JSON.stringify(state.filterSelect))
        },
        setFilterlocalStorage() {
            let object = JSON.parse(localStorage.getItem('filterSelect'))
            for (let key in object) {
                this._vm.$set(state.filterSelect, key, object[key])
            }
        }
    },
    actions: {
        setMessageRead({ state, commit, dispatch }, { id, site_id, guest_uuid, type }) {
            let itemList = [],
                unreadType // private,guest
            if (type === 'operators') {
                itemList = state.operators.all
                unreadType = 'private'
            }
            if (type === 'visitors') {
                itemList = state.visitors.self
                unreadType = 'guest'
            }
            let findIndex = itemList.findIndex(item => {
                if (type === 'visitors')
                    return item.guest_uuid + item.site_id === guest_uuid + site_id
                if (type === 'operators') return item.id === id
            })
            if (findIndex !== -1) {
                let unread = itemList[findIndex].unread

                commit(type + '/messageRead', findIndex)
                commit('user/unreadUpdate', [unreadType, -unread.length], {
                    root: true
                })
            }
        }
    },
    getters: {
        channelName: () => number => {
            let text = ''
            switch (number) {
                case 1:
                    text = 'виджет'
                    break
                case 2:
                    text = 'VK'
                    break
                case 3:
                    text = 'Facebook'
                    break
                case 4:
                    text = 'Slack'
                    break
                case 5:
                    text = 'Telegram'
                    break
                case 6:
                    text = 'Viber'
                    break
                case 7:
                    text = 'виджет'
                    break
                case 8:
                    text = 'SLACKIO'
                    break
                case 9:
                    text = 'Zendesk'
                    break
                case 10:
                    text = 'AMO'
                    break
                case 11:
                    text = 'SALESFORCE'
                    break
                case 12:
                    text = 'OPENAPI'
                    break
                case 13:
                    text = 'WhatsApp'
                    break

                default:
                    text = '-'

                    break
            }
            return text
        }
    }
})
