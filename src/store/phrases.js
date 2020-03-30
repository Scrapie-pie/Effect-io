import lodash_isObject from 'lodash/isObject'

const getDefaultState = () => {
    return {
        snippets: [],
        categories: [],
        use:{
            snippets: [],
            categories: [],
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
        categoryAdd(state, val) {
            console.log(val);
            let findIndex = state.categories.findIndex(item=>item.id===val.id)
            if(findIndex==-1) state.categories.push(val)
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
        snippetCreate({ commit }, { text, category, is_common,site_id,branches_ids }) {
            let id;

            if(lodash_isObject(category)){
                id = category.id
                category = category.title
            }

            if(!is_common) {
                category=null;
                site_id=null
                branches_ids=null
            }

            this._vm.$http
                .post('snippet/create-snippet', { text,category,  is_common,site_id,branches_ids })
                .then(({ data }) => {
                    console.log(data);
                    console.log(id);


                    if(!is_common) category='Свои шаблоны'

                    //значит новая категория, обновим список
                    commit('categoryAdd', {
                        id: data.data.category_id,
                        title:category,
                        is_common,
                        site_id
                    })

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
        getItemList({ commit,rootGetters }) {
            let params = {

            }
            //if(rootGetters['user/isRole'](['admin', 'owner', 'operatorSenior'])) {
            params.type='edit'
            //}
            this._vm.$http.get('snippet/read-snippet',{params}).then(({ data }) => {
                commit('setPhraseList', data.data)
            })
        },
        getItemListUse({ commit,rootGetters },{site_id}) {
            let params = {
                type:'use',
                site_id
            }



            this._vm.$http.get('snippet/read-snippet',{params}).then(({ data }) => {
                commit('setPhraseListUse', data.data)
            })
        }
    },
    getters: {

        categories: (state, getters,rootState,rootGetters)  => {
            console.log(rootState.user.siteCompanyList);
            if(rootState.user.siteCompanyList.length>1) return state.categories.map(item=>{
                if(!item.site_id) item.titleAndUrl = item.title
                else item.titleAndUrl = item.title+' (' + rootState.user.siteCompanyList?.find(site=>site.id===item.site_id)?.url+')'
                return item
            })
            return state.categories.map(item=>{
                item.titleAndUrl = item.title
                return item
            })
        },

    }
}
