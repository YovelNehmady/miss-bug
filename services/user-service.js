const utilService = require('./util.service.js')
let users = require('../data/user.json')

module.exports = {
    query,
    save,
    get,
    remove
}

function query(filterBy) {
    let filterdUsers = users

    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        filterdUsers = filterdUsers.filter(user => regex.test(user.title) || regex.test(user.description))
    }

    if (filterBy.label) {
        filterdUsers = filterdUsers.filter(user => user.labels.some(label => label === filterBy.label))
    }

    if (filterBy.sortBy) {
        filterdUsers.sort((b1, b2) => (b1[filterBy.sortBy] - b2[filterBy.sortBy]) * filterBy.desc)
    }

    return Promise.resolve(filterdUsers)
}

function get(userId) {
    const user = users.find(user => user._id === userId)
    return Promise.resolve(user)
}

function remove(userId) {
    const idx = users.findIndex(user => user._id === userId)
    if (idx === -1) return Promise.reject('No such user')
    users.splice(idx, 1)
}

function save(user) {
    if (user._id) {
        const userToUpdate = users.find(currUser => currUser._id === user._id)
        userToUpdate.title = user.title
        userToUpdate.description = user.description
        userToUpdate.severity = user.severity
    } else {
        user._id = utilService.makeId()
        user.createdAt = Date.now()
        users.push(user)
    }
    return utilService.writeUsersToFile(users).then(() => user)
}





