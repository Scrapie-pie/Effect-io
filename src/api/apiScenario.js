import axios from '@/modules/axios'

export default {
    all(params) {
        return axios.get('scenario/read', params)
    },
    addItem(data) {
        return axios.post('scenario/add', data)
    },
    removeItem(id) {
        return axios.delete('scenario/remove', { params: { id } })
    },
    changeItem(params) {
        return axios.put('scenario/change', params)
    }
}
