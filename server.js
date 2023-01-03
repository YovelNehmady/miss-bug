const express = require('express')
const cookieParser = require('cookie-parser')
const bugService = require('./services/bug-service.js')

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

//List
app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
})

//Update - put
app.put('/api/bug/:bugId', (req, res) => {
    const bug = req.body
    bugService.save(bug)
        .then(savedBug => res.send(savedBug))
})


//Create - post
app.post('/api/bug/', (req, res) => {
    const bug = req.body
    bugService.save(bug)
        .then(savedBug => res.send(savedBug))
})

//Read
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    let visitedBugs = req.cookies.visitedBugs || []
    if (!visitedBugs.includes(bugId)) {
        if (visitedBugs.length >= 3) {
            res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })
            return res.status(401).send('Wait for a bit')
        }
        visitedBugs.push(bugId)
    }
    bugService.get(bugId)
        .then(bug => {
            res.cookie('visitedBugs', visitedBugs)
            res.send(bug)
        })
})

//Remove
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(bugs => res.send(bugs))
})


app.listen(3030, () => console.log('Server ready at port 3030! http://localhost:3030/'))