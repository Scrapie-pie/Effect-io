const getDefaultState = () => {
    return {
        snippets: [],
        categories: []
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
        categoryAdd(state, val) {
            state.categories.push(val)
        },
        snippetAdd(state, val) {
            state.snippets.push(val)
        },
        setSnippetText(state, { id, text }) {
            let findIndex = state.categories.findIndex(item => item.id === id)
            if (findIndex !== -1) {
                state.categories[findIndex].text = text
            }
        },
        setСategoriesItem(state, { id, title }) {
            let findIndex = state.snippets.findIndex(item => item.id === id)
            if (findIndex !== -1) {
                state.snippets[findIndex].title = title
            }
        },
        setSnippetDelete(state, id) {
            let findIndex = state.snippets.findIndex(item => item.id === id)
            if (findIndex != -1) state.snippets.splice(findIndex, 1)
        },
        setPhraseList(state, { snippets, categories }) {
            state.snippets = snippets
            state.categories = categories
        }
    },
    actions: {
        snippetCreate({ commit }, { text, category: { title, id }, is_common }) {
            let category = title
            this._vm.$http
                .post('snippet/create-snippet', { text, category, is_common })
                .then(({ data }) => {
                    if (!id) {
                        //значит новая категория, обновим список
                        commit('categoryAdd', {
                            id: data.data.category_id,
                            title
                        })
                    }
                    commit('snippetAdd', data.data)
                })
        },
        snippetUpdate({ commit }, { id, text }) {
            this._vm.$http.put('snippet/update-snippet', { id, text }).then(() => {
                commit('setSnippetText', { id, text })
            })
        },
        categoriesUpdate({ commit }, { id, title }) {
            this._vm.$http.put('snippet/update-category', { id, title }).then(() => {
                commit('setСategoriesItem', { id, title })
            })
        },
        snippetDelete({ commit }, id) {
            this._vm.$http.delete('snippet/delete-snippet', { params: { id } }).then(() => {
                commit('setSnippetDelete', id)
            })
        },
        categoriesDelete({ commit,dispatch }, id) {
            this._vm.$http.delete('snippet/delete-category', { params: { id } }).then(() => {
                dispatch('getItemList')
            })
        },
        getItemList({ commit }) {
            this._vm.$http.get('snippet/read',{params:{type:'edit'}}).then(({ data }) => {
                commit('setPhraseList', data.data)
            })
        }
    }
}
