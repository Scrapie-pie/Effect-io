const getDefaultState = () => {
    return {
        items: [],
        getFirst: false
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
        set(state, val) {
            state.items = val
        }
    },
    actions: {
        update({ commit }, { tags, is_tag_required,branch_id }) {
            this._vm.$http
                .post('tag/tag/set-settings', { tags, is_tag_required:is_tag_required,branch_id })
                .then(({ data }) => {
                    commit('set', data.data)
                })
        },
        get({ commit }) {
            if (this.getFirst) return
            this._vm.$http.get('tag/tag/list').then(({ data }) => {
                commit('set', data.data)
            })
        },
        setTagChat({}, { tag_id, site_id, guest_uuid, comment }) {
            this._vm.$http.post('tag/tag/set-chat-tag', { tag_id, site_id, guest_uuid, comment })
        }
    },
    getters: {
        itemList: state => {
            return state.items
        }
    }
}
