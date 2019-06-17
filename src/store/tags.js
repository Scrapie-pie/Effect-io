import _ from 'underscore'

const getDefaultState = () => {
    return {
        tags:[],
        is_tag_required_in_chat:0
    }
}
// initial state
const state = getDefaultState()

export default {
    namespaced: true,
    state,
    mutations: {
        setItemList(state,val){
            state.tags = val

        },
    },
    actions: {

        updateItemList({commit},{tags,is_tag_required_in_chat}){
            this._vm.$http.post('tag/tag/set-settings',{tags,is_tag_required_in_chat})
                .then(({ data }) => {
                    commit('setItemList', data.data)
                })
        },

        getItemList({commit}){
            this._vm.$http.get('tag/tag/list')
                .then(({ data }) => {
                    commit('setItemList',data.data)
                })
        },
    },

}
