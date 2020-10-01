const express = require("express")
const db = require("./database")

const server = express()

// this allows us to parse request JSON bodies
server.use(express.json())

// POST (CREATE in Crud acronym)
server.post("/users", (req, res) => {
    const newUser = db.createUser({
        name: req.body.name,
        bio: req.body.bio,
    })
    // If the request body is missing the "name" or "bio" property:
    if (!req.body.name || !req.body.bio) {
        // respond with HTTP status 400 (Bad Request)
        return res.status(400).json({
            errorMessage: "Please provide name and bio for the user."
        }) // and return the preceding JSON object.
    }
    // If the info about the user is valid:
    if (newUser) {
        // respond with HTTP status code 201 (Created), 
        // and return the newly created user document.
        res.status(201).json(newUser)
    } else { // If there's an error while saving the user: 
        // respond with HTTP status code 500 (Server Error),
        res.status(500).json({ 
            errorMessage: "There was an error while saving the user to the database"
        }) // and return the preceding JSON object.
    }
})

// GET USERS (READ in cRud acronym)
server.get("/users", (req, res) => {
    const users = db.getUsers()

    if (users) {
        res.json(users)
    } else {
        // How do I test for a data retrieval (500) error?
        // If there's an error in retrieving the users from the database:
        // respond with HTTP status code 500 (Server Error),
        res.status(500).json({
            errorMessage: "The users information could not be retrieved." 
        }) // and return the preceding JSON object.
    }
})

// GET BY USER ID (READ in cRud)
server.get("/users/:id", (req, res) => {
    const id = req.params.id
    const user = db.getUserById(id)

    if (user) {
        res.json(user) 
    } else {
        // If the user with the specified id is not found:
        // respond with HTTP status code 404 (Not Found),
        res.status(404).json({
            message: "The user with the specified ID does not exist."
        }) // and return the preceding JSON object.
    }
    // Is the following if/else valid, redundant, or useless?
    // And how do I test for a data retrieval (500) error?

    if (user) {
        res.json(user)
    } else {
        // If there's an error in retrieving the user from the database:
        // respond with HTTP status code 500 (Server Error),
        res.status(500).json({
            errorMessage: "The user information could not be retrieved."
        }) // and return the preceding JSON object.
    }
})

// PUT (UPDATE in crUd acronym)
server.put("/users/:id", (req, res) => {
    const id = req.params.id
    const user = db.getUserById(id)

    // If the request body is missing the "name" or "bio" property:
    if (!req.body.name || !req.body.bio) {
        // respond with HTTP status 400 (Bad Request)
        return res.status(400).json({
            errorMessage: "Please provide name and bio for the user."
        }) // and return the preceding JSON object.
    }

    // If the user is found and the new info is valid:
    if (user) {
        const updatedUser = db.updateUser(id, {
            name: req.body.name,
            bio: req.body.bio 
        })
        // update the user document in the database using the new 
        // info sent in the request body.
        res.json(updatedUser) 
    } else {
        // If the user with the specified id is not found:
        // respond with HTTP status code 404 (Not Found),
        res.status(404).json({
            message: "The user with the specified ID does not exist.",
        }) // and return the preceding JSON object.
    }

    // If there's an error when updating the user:
        // respond with HTTP status code 500 (Server Error)
        // and return the preceding JSON object.
})

// DELETE (DESTROY in cruD acronym)
server.delete("/users/:id", (req, res) => {
    const id = req.params.id
    const user = db.getUserById(id)

    if (user) {
        db.deleteUser(id)
        // 204 = successful empty response
        res.status(204).end()
    } else {
        // If the user with the specified id is not found: 
        // respond with HTTP status code 404 (Not Found),
        res.status(404).json({
            message: "The user with the specified ID does not exist."
        })  // and return the preceding JSON object.
    }
    // If there's an error in removing the user from the database:
    // status code: 500 (Server Error)
    // { errorMessage: "The user could not be removed" }
})

server.listen(8080, () => {
    console.log("The server is listening.")
})