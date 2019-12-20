const getDefaultState = () => {
    return {
        history: [],
        emitList: {
            message: 'emitSocketGetMessage',
            'need-update-widget': 'emitSocketNeedUpdateWidget',
            'contacts-request': 'emitSocketContactsRequest',
            'rating-request': 'emitSocketRatingRequest',
            'update-active-chat-id': 'emitSocketUpdateActiveChatId',
            'guest-redirect': 'emitSocketGuestRedirect'
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
            //console.log('socket historyPush',val);
            state.history.push(val)
            //state.messages.push(state.messagesTemp)
        },
        historyClear(state) {
            //console.log('socket historyPush',val);
            state.history=[]
            //state.messages.push(state.messagesTemp)
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
