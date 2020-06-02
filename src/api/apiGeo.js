import axios from '@/modules/axios'

export default {
    countries(params) {
        return axios.get('geo/get-countries', params).then(data => {
            return data.data.data
        })
    },
    cities(params) {
        console.log(params);
        return axios.get('geo/get-cities', {params}).then(data => {
            return data.data.data
        })
    }
}
