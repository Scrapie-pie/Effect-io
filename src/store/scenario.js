const getDefaultState = () => {
    return {
        all: []
    }
}
// initial state
const state = getDefaultState()


import {apiScenario} from "@/api/api";

export default {
    namespaced: true,
    state,
    mutations: {
        resetState(state) {
            Object.assign(state, getDefaultState())
        },
        all(state, val) {
            state.all = val
        },

    },
    actions: {
        getAll({state, commit, dispatch }) {
            return apiScenario.all()
                .then(({ data }) => {
                    console.log(data);
                    return commit('all', data.data)
                })
        },
        removeItem({state, commit, dispatch },id) {

            return apiScenario.removeItem(id)
                .then(({ data }) => {
                    console.log(data);
                    let list = state.all
                    let findIndex = list.findIndex(
                        item => item.id===id
                    )
                    if (findIndex !== -1) list.splice(findIndex, 1)
                    return commit('all', list)

                })
        },
        changeItem({state, commit, dispatch },data) {

            return apiScenario.changeItem(data)
                .then(({ data:{data} }) => {

                    let id = data.id
                    let list = state.all
                    let findIndex = list.findIndex(
                        item => item.id===id
                    )
                    if (findIndex !== -1) {
                        list[findIndex] = data
                        console.log(data);
                    }
                    return commit('all', list)

                })
        },
        addItem({state, commit, dispatch },data) {

            return apiScenario.addItem(data)
                .then(({ data:{data} }) => {


                    let list = state.all
                    list.push(data)
                    commit('all', list)

                    return data

                })
        }
    },
    getters: {
        gettersAll: (state, getters, rootState) => {

            return state.all
        },

    }
}
