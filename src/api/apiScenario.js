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
    copyItem(id) {
        return axios.post('scenario/copy', { id })
    },
    changeItem(params) {
        return axios.put('scenario/change', params)
    }
}
