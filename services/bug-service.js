const utilService = require('./util.service.js')
let bugs = require('../data/bug.json')
const  userService  = require('./user-service.js')

module.exports = {
    query,
    save,
    get,
    remove
}

function query(filterBy) {
    let filterdBugs = bugs

    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        filterdBugs = filterdBugs.filter(bug => regex.test(bug.title) || regex.test(bug.description))
    }

    if (filterBy.label) {
        filterdBugs = filterdBugs.filter(bug => bug.labels.some(label => label === filterBy.label))
    }

    if (filterBy.sortBy) {
        filterdBugs.sort((b1, b2) => (b1[filterBy.sortBy] - b2[filterBy.sortBy]) * filterBy.desc)
    }

    return Promise.resolve(filterdBugs)
}

function get(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('No such bug')
    bugs.splice(idx, 1)

    // bugs = bugs.filter(bug => bug._id !== bugId)
    return utilService.writeBugsToFile(bugs).then(() => bugs)
}

function save(bug, miniUser) {
    const validMiniUser = userService.validateToken(miniUser)
    const creator = { _id: validMiniUser._id, fullname: validMiniUser.fullname }
    if (bug._id) {
        const bugToUpdate = bugs.find(currBug => currBug._id === bug._id)
        bugToUpdate.title = bug.title
        bugToUpdate.description = bug.description
        bugToUpdate.severity = bug.severity
    } else {
        bug._id = utilService.makeId()
        bug.createdAt = Date.now()
        bug.creator = creator
        bugs.push(bug)
    }
    return utilService.writeBugsToFile(bugs).then(() => bug)
}



