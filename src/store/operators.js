export default {
    namespaced: true,
    state: {
        all:[],


    },
    mutations: {
        all(state, val) {
            state.all=val;
        },
    },
    actions: {
        getAll({ commit, dispatch }) {
            this._vm.$http.get('employee-company-list').then(({data})=>{

                commit('all',data.data)
            })
        },
    },
    getters: {
        all: (state, getters,rootState) => {

            for (let prop in state.all) {

                let list = rootState.user.branchListAll.filter((item)=>{
                    if(state.all[prop].branches_ids.includes(item.id)) return item

                });


                state.all[prop].branches_names = list.map(item=>item.title)


            }
            return state.all
        }
    }
}
