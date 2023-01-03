const utilService = require('./util.service.js')
let bugs = require('../data/bugs.json')

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
    return Promise.resolve(filterdBugs)
}

function get(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    bugs = bugs.filter(bug => bug._id !== bugId)
    return utilService.writeBugsToFile(bugs).then(() => bugs)
}

function save(bug) {
    if (bug._id) {
        const bugToUpdate = bugs.find(currBug => currBug._id === bug._id)
        bugToUpdate.title = bug.title
        bugToUpdate.description = bug.description
        bugToUpdate.severity = bug.severity
    } else {
        bug._id = utilService.makeId()
        bug.createdAt = Date.now()
        bugs.push(bug)
    }
    return utilService.writeBugsToFile(bugs).then(() => bug)
}



