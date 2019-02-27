export default {
    namespaced: true,
    state: {
        all:[],


    },
    mutations: {
        'SOCKET_UPDATE-EMPLOYEES'(state, val){
            console.log('SOCKET_UPDATE-EMPLOYEES',val);
            state.all=val;
        },
        all(state, val) {
            state.all=val;
        },
        messageRead(state,userIndex) {
            state.all[userIndex].unread=[];
        },
        messageLastUpdate(state, val) {

            let findIndex = state.all.findIndex((item)=>{
                if(val.selfId) return item.id === val.selfId; //selfId значит мое сообщение
                else return item.employee_id === val.from_user_info.id
            })

            if(findIndex !== -1) {
                state.all[findIndex].last_message = val.body;
                state.all[findIndex].last_message_author = val.from_user_info.name;

                if(!val.selfId) state.all[findIndex].unread.push(val.id);

            }
        }
 /*       'SOCKET_NEW-MESSAGE'(state, val) {
            console.log('SOCKET_NEW_MESSAGE',val.from_user_info.id)
            console.log(state.all);
            let findIndex = state.all.findIndex((item)=>{
                return (item.employee_id === val.from_user_info.id)
            })
            if(findIndex !== -1) {
                state.all[findIndex].last_message = val.body;
                state.all[findIndex].last_message_author = val.first_name;
            }

        },*/

    },
    actions: {
        getAll({ commit, dispatch }) {
            this._vm.$http.get('employee-company-list',{
                params:{
                    with_branches_ids:1,
                    with_unread:1,
                    with_last_messages:1
                }
            }).then(({data})=>{
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
