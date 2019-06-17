

const getDefaultState = () => {
    return {
        snippets:[],
        categories:[]
    }
}
// initial state
const state = getDefaultState()

export default {
    namespaced: true,
    state,
    mutations: {
        resetState (state) {
            Object.assign(state, getDefaultState())
        },
        categoryAdd(state,val){
            state.categories.push(val);
        },
        snippetAdd(state,val){
            state.snippets.push(val);
        },
        setSnippetText(state,{id,text}){
            let findIndex = state.snippets.findIndex((item)=>item.id===id)
            if(findIndex!==-1) {
                state.snippets[findIndex].text = text
            }
        },
        setSnippetDelete(state,id){
            let findIndex = state.snippets.findIndex((item)=>item.id===id)
            if(findIndex!=-1) state.snippets.splice(findIndex,1)
        },
        setPhraseList(state,{snippets,categories}){
            state.snippets = snippets
            state.categories = categories
        },
    },
    actions: {
        snippetCreate({commit},{text,category:{title,id},is_common}){
            let category = title;
            this._vm.$http.post('snippet/create-snippet',{text,category,is_common})
                .then(({ data }) => {
                    if(!id) { //значит новая категория, обновим список
                        commit('categoryAdd',{
                            id:data.data.category_id,
                            title
                        })
                    }
                    commit('snippetAdd',data.data )
                })
        },
        snippetUpdate({commit},{id,text}){
            this._vm.$http.put('snippet/update-snippet',{id,text})
                .then(() => {
                    commit('setSnippetText', {id,text})
                })
        },
        snippetDelete({commit},id){
            this._vm.$http.delete('snippet/delete-snippet',{params:{id}})
                .then(() => {
                    commit('setSnippetDelete', id)
                })
        },
        getItemList({commit}){
            this._vm.$http.get('snippet/read-snippet')
                .then(({ data }) => {
                    commit('setPhraseList',data.data)
                })
        },
    },

}
