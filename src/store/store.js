import Vue from 'vue'
import Vuex from 'vuex'

import user from '@/store/user'
import scenario from '@/store/scenario'
import phrases from '@/store/phrases'
import tags from '@/store/tags'
import operators from '@/store/operators'
import visitors from '@/store/visitors'
import roomActive from '@/store/roomActive'
import sockets from '@/store/storeSockets'
import mobile from '@/store/storeMobile'
import resize from '@/store/storeResize'
import { store as actionAnotherTab } from '@/modules/actionAnotherTab.js'

//import rooms from '@/store/rooms'

Vue.use(Vuex)

import createMutationsSharer from 'vuex-shared-mutations'

const getDefaultStateRoom = () => {
    return {}
}

const getDefaultFilterSelect = () => {
    return {
        filterSelect: {
            url: undefined,
            calendar: undefined,
            last_days: undefined,
            siteCompanyPhrasesTop:undefined,
            siteCompanyPhrasesAdd:undefined,
            branchPhrasesTop:undefined,
            branchPhrasesAdd:undefined,
        }
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
            ]

            /*  actionAnotherTab:{
                mutation:'',
                payload:{},
                routerPush:''
            }*/
        },
        getDefaultFilterSelect(),
        getDefaultStateRoom()
    )
}
// initial state
const state = getDefaultState()

export default new Vuex.Store({
    modules: {
        scenario,
        resize,
        mobile,
        sockets,
        user,
        phrases,
        tags,
        operators,
        visitors,
        roomActive,
        actionAnotherTab
        //rooms
    },
    state,
    plugins: [
        createMutationsSharer({
            predicate: (mutation, state) => {
                /* if (
                    mutation.type == 'user/unreadUpdate' &&
                    mutation.payload.toString() === ['unprocessed', -1].toString()
                )
                    return true*/
                const predicate = [
                    'actionAnotherTab/setState'
                    //'user/unreadUpdate'
                ]
                // Conditionally trigger other plugins subscription event here to
                // have them called only once (in the tab where the commit happened)
                // ie. save certain values to localStorage
                // pluginStateChanged(mutation, state)
                return predicate.indexOf(mutation.type) >= 0
            }
        })
    ],
    mutations: {
        resetState(state) {
            localStorage.removeItem('filterSelect')

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
                if (unreadType === 'guest')
                    return commit('user/unreadUpdate', [unreadType, -1], { root: true })
                commit('user/unreadUpdate', [unreadType, -unread.length], { root: true })
            }
        }
    },
    getters: {
        channelName: () => number => {
            let text = ''
            switch (number) {
                case 1:
                    text = 'widget'
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
                    text = 'widget'
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
