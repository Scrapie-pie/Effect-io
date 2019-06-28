const getDefaultState = () => {
    return {
        id: false,

        visitor: {
            guest_uuid: '', // использую для функции typingLive
            site_id: '', // использую для функции typingLive
            typingLive: ''
        },

        users: [],
        usersActive: [],
        usersInvited: [],
        usersRecipient: [],
        usersUnprocessed: [],
        isAdmin: false
    }
}
// initial state
const state = getDefaultState()

export default {
    namespaced: true,
    state,
    mutations: {
        resetState(state) {
            Object.assign(state, getDefaultState())
        },
        typingLive(state, { message, guest_uuid, site_id }) {
            let visitor = state.visitor
            if (visitor.guest_uuid + visitor.site_id === guest_uuid + site_id)
                state.visitor.typingLive = message
        },
        set(state, val) {
            //console.log('roomActive', val);

            function getIds(status) {
                let users = val.filter(
                    item => item.status === status && item.room_id === state.id
                )
                return users.map(item => item.user_id)
            }


            if (val.visitor) {
                state.visitor.guest_uuid = val.visitor.guest_uuid
                state.visitor.site_id = val.visitor.site_id
            }
            state.visitor.typingLive = '' // очищаем при переходе в другую комнату


            state.isAdmin = val.filter(
                item => item.isAdmin && item.user_id === this.getters['user/profile'].id
            ).length
            if (!val.socket) state.id = val[0].room_id //это тольк одля запроса, значит открыли чат
            if (state.id !== val[0].room_id) return // если комнаты совпадают, значит диалог открыт, обновляем, если сокет по чужым то игнорим
            state.users = val
            state.usersActive = getIds('active')
            state.usersRecipient = getIds('recipient').map(id => {
                return this.getters['operators/all'].find(item => item.id === id)
            })
            state.usersInvited = getIds('invited').map(id => {
                return this.getters['operators/all'].find(item => item.id === id)
            })
            state.usersUnprocessed = getIds('unprocessed').map(id => {
                return this.getters['operators/all'].find(item => item.id === id)
            })
        },


    },
    actions: {

    }
}
