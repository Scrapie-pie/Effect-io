const getDefaultState = () => {
    return {
        history: [],
        emitList: {
            'hot-guest':'emitHotGust',
            'new-message':'emitNewMessage',
            'guest-new-session':'emitGuestNewSession',
            'update-guest-employee':'emitUpdateGuestEmployee',
            'guest-update':'emitGuestUpdate',
            'message-delivered':'emitMessageDelivered',
            'update-branches':'emitUpdateBranches',
            'room-users':'emitRoomUsers',
            'unprocessed':'emitUnprocessed',
            'auto-attach':'emitAutoAttach',
            'self-remove':'emitSelfRemove',
            'unprocessed-remove':'emitUnprocessedRemove',
            'update-employees':'emitUpdateEmployees',
            'employee-online':'emitEmployeeOnline'
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
