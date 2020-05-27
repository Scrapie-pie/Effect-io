import axios from '@/modules/axios'





export default {
    countries(params) {

        return axios.get('geo/get-countries', params).then(data=>{
            return data.data.data
        })

    },



}
