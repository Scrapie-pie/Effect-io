import lodash_isObject from 'lodash/isObject'

const getDefaultState = () => {
    return {
        snippets: [],
        categories: [],
        use: {
            snippets: [],
            categories: []
        },
        selectSnippetId: null
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
            console.log(val)
            let findIndex = state.categories.findIndex(item => item.id === val.id)
            if (findIndex == -1) state.categories.push(val)
        },
        setSelectSnippetId(state, id) {
            state.selectSnippetId = id
        },
        snippetAdd(state, val) {
            state.snippets.push(val)
        },
        setSnippetText(state, { id, text }) {
            let findIndex = state.snippets.findIndex(item => item.id === id)
            if (findIndex !== -1) {
                state.snippets[findIndex].text = text
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
        },
        setPhraseListUse(state, { snippets, categories }) {
            state.use.snippets = snippets
            state.use.categories = categories
        }
    },
    actions: {
        snippetCreate({ commit, dispatch }, { text, category, is_common, branches_ids }) {
            let obj = {}

            if (lodash_isObject(category)) {
                if (category.id) obj.category_id = category.id
                else {
                    obj.category = category.titleBranchSite
                }
            } else {
                obj.category = category
            }

            if (!is_common) {
                branches_ids = null
            }

            this._vm.$http
                .post('snippet/create-snippet', {
                    text,
                    ...obj,
                    is_common,

                    branches_ids
                })
                .then(({ data }) => {
                    dispatch('getItemList')
                })
        },
        snippetUpdate({ commit, dispatch }, { id, text, category }) {
            this._vm.$http
                .put('snippet/update-snippet', { id, text, category_id: category.id })
                .then(() => {
                    dispatch('getItemList')
                })
        },
        categoriesUpdate({ commit, dispatch }, { title, id, branches_ids }) {
            return this._vm.$http
                .put('snippet/update-category', { title, id, branches_ids })
                .then(() => {
                    dispatch('getItemList')
                })
        },
        snippetDelete({ commit, dispatch }, id) {
            this._vm.$http.delete('snippet/delete-snippet', { params: { id } }).then(() => {
                dispatch('getItemList')
            })
        },
        categoriesDelete({ commit, dispatch }, id) {
            this._vm.$http.delete('snippet/delete-category', { params: { id } }).then(() => {
                dispatch('getItemList')
            })
        },
        getItemList({ commit, rootGetters }) {
            let params = {}
            //if(rootGetters['user/isRole'](['admin', 'owner', 'operatorSenior'])) {
            params.type = 'edit'
            //}
            this._vm.$http.get('snippet/read-snippet', { params }).then(({ data }) => {
                commit('setPhraseList', data.data)
            })
        },
        getItemListUse({ commit, rootGetters }, { site_id }) {
            let params = {
                type: 'use',
                sort_by_use: 1,
                site_id
            }

            this._vm.$http.get('snippet/read-snippet', { params }).then(({ data }) => {
                commit('setPhraseListUse', data.data)
            })
        }
    },
    getters: {
        categories: (state, getters, rootState, rootGetters) => {
            let categories = state.categories
            if (rootState.user.siteCompanyList.length > 1)
                return categories.map(item => {
                    if (!item.site_id) item.titleAndUrl = item.title
                    else
                        item.titleAndUrl =
                            item.title +
                            ' (' +
                            rootState.user.siteCompanyList?.find(site => site.id === item.site_id)
                                ?.url +
                            ')'
                    return item
                })
            return categories.map(item => {
                item.titleAndUrl = item.title
                return item
            })
        },
        categoriesUse: (state, getters, rootState, rootGetters) => {
            let categories = state.use.categories

            if (rootState.user.siteCompanyList.length > 1)
                return categories.map(item => {
                    if (!item.site_id) item.titleAndUrl = item.title
                    else
                        item.titleAndUrl =
                            item.title +
                            ' (' +
                            rootState.user.siteCompanyList?.find(site => site.id === item.site_id)
                                ?.url +
                            ')'
                    return item
                })
            return categories.map(item => {
                item.titleAndUrl = item.title
                return item
            })
        }
    }
}
