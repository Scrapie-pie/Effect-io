const getDefaultState = () => {
    return {
        visitors: []
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

        saveTextAreaRoom(state, { pageName, ids, textArea }) {
            let findIndex
            if (pageName === 'visitors') {
                let { guest_uuid, site_id } = ids
                findIndex = state.visitors.findIndex(
                    item => item.guest_uuid + item.site_id === guest_uuid + site_id
                )
                if (findIndex !== -1) {
                    this._vm.$set(state.visitors, findIndex, {
                        site_id,
                        guest_uuid,
                        textArea
                    })
                } else {
                    state.visitors.push({})
                }
            }
        }
    },
    actions: {
        /*    getAll({ commit, dispatch }) {
            this._vm.$http
                .get('employee/company-list', {
                    params: {
                        with_branches_ids: 1,
                        with_unread: 1,
                        with_last_messages: 1
                    }
                })
                .then(({ data }) => {
                    commit('all', data.data)
                })
        }*/
    },
    getters: {
        all: (state, getters, rootState) => {
            state.all.map(room => {
                return room
            })
            return state.all
        }
    }
}
