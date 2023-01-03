const URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getEmptyFilter
}

function getEmptyFilter() {
    return { txt: '' }
}

function query(filterBy) {
    return axios.get(URL)
        .then(res => {
            let bugs = res.data
            if (filterBy) {
                const regex = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regex.test(bug.title) || regex.test(bug.description))
            }
            return bugs
        })
}

function getById(bugId) {
    const path = URL + bugId
    return axios.get(path).then(res => res.data)
}

function remove(bugId) {
    const path = URL + bugId + '/remove'
    return axios.delete(path).then(res => res.data)
}

function save(bug) {
    const path = (bug._id) ? URL + `${bug._id}` : URL
    const method = (bug._id) ? 'put' : 'post'
    return axios[method](path, bug).then(res => res.data)
}