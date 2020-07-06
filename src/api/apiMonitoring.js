import axios from '@/modules/axios'

export default {
    get(params) {
        return axios.get('monitoring/read', params).then(({ data }) => data.data)
    }
}
