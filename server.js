const express = require('express')
const cookieParser = require('cookie-parser')
const bugService = require('./services/bug-service.js')
const userService = require('./services/user-service.js')

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

//Bug API
//List
app.get('/api/bug/', (req, res) => {
    const filterBy = req.query
    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
})

//Update - put
app.put('/api/bug/:bugId', (req, res) => {
    const miniUser = req.cookies.loginToken
    const bug = req.body
    bugService.save(bug, miniUser)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            console.log('Error:', err)
            res.status(401).send('Unauthorized')
        })
})


//Create - post
app.post('/api/bug/', (req, res) => {
    const miniUser = req.cookies.loginToken
    const bug = req.body
    bugService.save(bug, miniUser)
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
    const miniUser = req.cookies.loginToken
    const { bugId } = req.params
    bugService.remove(bugId, miniUser)
        .then(bugs => res.send(bugs))
        .catch(err => {
            console.log('Error:', err)
            res.status(401).send('Unauthorized')
        })
})

//User API
// List
app.get('/api/user', (req, res) => {
    const filterBy = req.query
    userService.query(filterBy)
        .then((users) => {
            res.send(users)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get users')
        })
})

// Read
app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.get(userId)
        .then((user) => {
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get user')
        })
})

// Login
app.post('/api/user/login', (req, res) => {
    const { username, password } = req.body
    userService.login({ username, password })
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            res.status(400).send('Cannot get user')
        })
})

// Logout
app.post('/api/user/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})


// Signup
app.post('/api/user/signup', (req, res) => {
    const { fullname, username, password } = req.body
    userService.signup({ fullname, username, password })
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            res.status(400).send('Cannot create user')
        })
})





app.listen(3030, () => console.log('Server ready at port 3030! http://localhost:3030/'))