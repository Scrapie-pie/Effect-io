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
            state.all.forEach((operator)=>{
                let list = rootState.user.branchListAll.filter((item)=>{
                    if(operator.branches_ids.includes(item.id)) return item

                });

                operator.branches_names = list.map(item=>item.title)
                operator.fullName = operator.first_name +' '+ operator.last_name;

                let onlineText = ['оффлайн','онлайн','перерыв','обед'];

                operator.statusText = onlineText[operator.online];




            })
            return state.all
        }
    }
}