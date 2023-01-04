const URL = 'https://miss-bug-j91v.onrender.com/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getEmptyFilter
}

function getEmptyFilter() {
    return { txt: '', sortBy: '', desc: 1, label: '' }
}

function query(filterBy = getEmptyFilter()) {
    const queryParams = `?txt=${filterBy.txt}&sortBy=${filterBy.sortBy}&desc=${filterBy.desc}&label=${filterBy.label}`
    return axios.get(URL + queryParams)
        .then(res => res.data)
}

function getById(bugId) {
    const path = URL + bugId
    return axios.get(path).then(res => res.data)
}

function remove(bugId) {
    const path = URL + bugId
    return axios.delete(path).then(res => res.data)
}

function save(bug) {
    const path = (bug._id) ? URL + `${bug._id}` : URL
    const method = (bug._id) ? 'put' : 'post'
    return axios[method](path, bug).then(res => res.data)
}