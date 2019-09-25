import lodash_isEmpty from 'lodash/isEmpty'

const getDefaultState = () => {
    return {
        all: [],
        allCount: false,
        visor: [],
        search: [],
        searchCount: false,
        visorCount: false,
        process: [],
        processCount: false,
        processLastPageN: 1,
        self: [],
        selfCount: false,
        selfLastPageN: null,
        itemOpen: false,
        itemOpenHistoryActions: false
    }
}
// initial state
const state = getDefaultState()

function commonSelfProcces(item) {
    item.awaiting_answer_time = new Date().getTime() / 1000 - item.awaiting_answer_time
    return item
}

export default {
    namespaced: true,
    state,
    mutations: {
        resetState(state) {
            Object.assign(state, getDefaultState())
        },

        newList(state, { field, val }) {
            this._vm.$set(state, field, val.list)
            console.log('newList', val.list)

            if (val.count) this._vm.$set(state, field + 'Count', val.count)
        },
        all(state, val) {
            //Todo походу не нужен
            state.all = val.list
            state.allCount = val.count
        },

        messageHot(
            state,
            {
                val: { guest_uuid, site_id, awaiting_answer_time },
                set
            }
        ) {
            let main = name => {
                let findIndex = state[name].findIndex(
                    item => item.guest_uuid + item.site_id === guest_uuid + site_id
                )

                if (findIndex !== -1) {
                    this._vm.$set(state[name][findIndex], 'hot', set)
                    this._vm.$set(
                        state[name][findIndex],
                        'awaiting_answer_time',
                        new Date().getTime() / 1000 - awaiting_answer_time
                    )
                }
            }

            main('process')
            main('self')
        },
        process(state, val) {
            state.process = val.list.map(commonSelfProcces)
            if (val.count) state.processCount = val.count
        },
        setProcessLastPageN(state, val) {
            state.processLastPageN = val
        },
        processMessageLastUpdate(state, val) {
            let findIndex = state.process.findIndex(item => {
                return item.guest_uuid + item.site_id === val.guest_uuid + val.site_id
            })

            if (findIndex !== -1) {
                state.process[findIndex].last_message = val.body
                state.process[findIndex].last_message_author = val.last_message_author
            } else {
                val.unread = []
                val.last_message = val.body
                console.log('state.process.push unprocessed')
                state.process.push(val)
                state.processCount += 1
            }
        },
        processRemoveItem(state, { guest_uuid, site_id }) {
            let findIndex = state.process.findIndex(
                item => item.guest_uuid + item.site_id === guest_uuid + site_id
            )
            if (findIndex !== -1) state.process.splice(findIndex, 1)
        },
        processRemoveItemAll(state) {
            state.process = []
            state.processCount = 0
        },
        self(state, val) {
            state.self = val.list.map(commonSelfProcces)
            if (val.count) state.selfCount = val.count
        },
        setSelfLastPageN(state, val) {
            state.selfLastPageN = val
        },

        selfMessageLastUpdate(state, val) {
            let findIndex = state.self.findIndex(item => {
                if (val.selfUuid) return item.guest_uuid === val.selfUuid
                //selfId значит мое сообщение
                else return item.guest_uuid + item.site_id === val.guest_uuid + val.site_id
            })

            if (findIndex !== -1) {
                this._vm.$set(state.self[findIndex], 'last_message', val.body)
                this._vm.$set(state.self[findIndex], 'last_message_author', val.last_message_author)
                this._vm.$set(state.self[findIndex], 'last_message_time', val.time)

                //this._vm.$set(state.self[findIndex],'name',val.from_user_info.name)
                if (
                    !val.selfUuid &&
                    val.from_role_id!=9 //не системное
                ) {
                    let unread = state.self[findIndex].unread
                    unread.push(val.id)
                    this._vm.$set(state.self[findIndex], 'unread', unread)
                }
            } else {
                //Если сообщение пришло, но в списке не было подгружено

                let unreadMas = val.from_role_id!=9?[val.id]:[]

                let selfNew = {
                    last_message: val.body,
                    last_message_author: val.last_message_author,
                    unread: unreadMas,
                    last_message_time: val.time,
                    guest_uuid: val.guest_uuid,
                    site_id: val.site_id,
                    photo: val.contact_info.photo,
                    photo_stub: val.contact_info.photo_stub,
                    name: val.contact_info.name,
                    regRuLogin: val.contact_info.regRuLogin
                }

                state.self.push(selfNew)
            }
        },
        selfMessageRemoveItem(state, { guest_uuid, site_id }) {
            let findIndex = state.self.findIndex(
                item => item.guest_uuid + item.site_id === guest_uuid + site_id
            )
            if (findIndex !== -1) state.self.splice(findIndex, 1)
        },
        messageRead(state, findIndex) {
            this._vm.$set(state.self[findIndex], 'unread', [])
        },
        itemOpen(state, val) {
            //val.regRuLogin = 'kakos'
            if (!val.name) val.name = 'Гость'
            state.itemOpen = val
        },
        itemOpenHistoryActions(state, val) {
            state.itemOpenHistoryActions = val
        }
    },
    actions: {
        getItems({ commit }, data) {
            this._vm.$http.get('guest/list', data).then(({ data }) => {
                if (!lodash_isEmpty(data.params.type) && data.params.type === 'self')
                    commit('self', data.data)
                if (!lodash_isEmpty(data.params.type) && data.params.type === 'unprocessed')
                    commit('process', data.data)
                else {
                    commit('all', data.data)
                }
            })
        },
        getAll({ commit }) {
            this._vm.$http.get('guest/list', {}).then(({ data }) => {
                commit('all', data.data)
            })
        },
        getProcess({ commit }, params) {
            params = Object.assign({ type: 'unprocessed', limit: 1 }, params)
            this._vm.$http.get('guest/list', { params }).then(({ data }) => {
                commit('process', data.data)
            })
        },
        getSelf({ commit }, params) {
            params = Object.assign({ type: 'self', limit: 1 }, params)
            this._vm.$http.get('guest/list', { params }).then(({ data }) => {
                commit('self', data.data)
            })
        },
        getItemOpen({ commit }, params) {
            /*      this._vm.$http.all([
                this._vm.$http.get('guest-info', {params}),
                this._vm.$http.get('read-history', {params}),
            ]).then(
                this._vm.$http.spread((itemOpen, itemOpenHistoryActions) => {
                    commit('itemOpen',itemOpen.data)
                    commit('itemOpenHistoryActions',itemOpenHistoryActions.data)

                })
            )
*/

            // return new Promise((resolve) => {

            return this._vm.$http.get('guest/info', params).then(({ data }) => {
                commit('itemOpen', data.data)
            })

            // });
        }
    },
    getters: {
        all: state => {
            return state.all
        },
        itemOpenIds: state => {
            return {
                guest_uuid: state.itemOpen.guest_uuid,
                site_id: state.itemOpen.site_id
            }
        }
    }
}
