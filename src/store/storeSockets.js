const getDefaultState = () => {
    return {
        history: [],
        emitList: {
            monitoring: 'emitMonitoring',
            'typing-live': 'emitTypingLive',
            'hot-guest': 'emitHotGust',
            'new-message': 'emitNewMessage',
            'guest-new-session': 'emitGuestNewSession',
            'update-guest-employee': 'emitUpdateGuestEmployee',
            'guest-update': 'emitGuestUpdate',
            'message-delivered': 'emitMessageDelivered',
            'update-branches': 'emitUpdateBranches',
            'room-users': 'emitRoomUsers',
            unprocessed: 'emitUnprocessed',
            'auto-attach': 'emitAutoAttach',
            'self-remove': 'emitSelfRemove',
            'unprocessed-remove': 'emitUnprocessedRemove',
            'update-employees': 'emitUpdateEmployees',
            'employee-online': 'emitEmployeeOnline',
            logout: 'emitLogout',
            'chat-tag-exist':'emitChatTagExist'
        }
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
        historyPush(state, val) {
            state.history.push(val)
        },
        historyClear(state) {
            state.history = state.history.slice(state.history.length - 20, state.history.length)
        }
    },
    actions: {},
    getters: {
        /*    isFirstMessageClient: state => {
            return state.messages.find(item => item.from_role_id == 8)
        },
        getMessages: state => {
            return lodash_uniqBy(state.messages, 'id')
        }*/
    }
}
