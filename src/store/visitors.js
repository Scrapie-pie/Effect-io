export default {
    namespaced: true,
    state: {
        all:[],
        itemOpen:false,
        itemOpenHistoryActions:false
    },
    mutations: {
        all(state, val) { //Todo походу не нужен
            state.all=val.list;
            state.allCount=val.count;
            val.list.forEach((item)=>{
                console.log(item.uuid);
            })
        },
        itemOpen(state, val) {
            state.itemOpen=val;
        },
        itemOpenHistoryActions(state, val) {
            state.itemOpenHistoryActions=val;
        },
    },
    actions: {
        getAll({ commit, dispatch }) {
            this._vm.$http.get('guest-list',{params:{
                type:'self'
                }}).then(({data})=>{

                commit('all',data.data)
            })
        },
        getItemOpen({ commit, dispatch },params) {

      /*      this._vm.$http.all([
                this._vm.$http.get('guest-info', {params}),
                this._vm.$http.get('read-history', {params}),
            ]).then(
                this._vm.$http.spread((itemOpen, itemOpenHistoryActions) => {
                    commit('itemOpen',itemOpen.data)
                    commit('itemOpenHistoryActions',itemOpenHistoryActions.data)

                })
            )
*/

           // return new Promise((resolve) => {
            this._vm.$http.get('read-history', {params}).then(({data})=>{
                commit('itemOpenHistoryActions',data.data)
            })

            return this._vm.$http.get('guest-info', {params}).then(({data})=>{
                commit('itemOpen',data.data)

            })



           // });
        },
    },
    getters: {
        all: (state) => {


            return state.all
        }
    }
}
