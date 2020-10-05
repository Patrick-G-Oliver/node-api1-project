const express = require("express")
const db = require("./database")

const server = express()

// this allows us to parse request JSON bodies
server.use(express.json())

// POST (CREATE in Crud acronym)
server.post("/users", (req, res) => {

    // Optionally, the body object may be destructured as follows:
    // const { name, bio } = req.body
    // This would allow for <if (name && bio) { . . . }> (see line 18)
    // See the .put handler below for an example.

    // If both the name and bio are included, create a newUser.
    if (req.body.name && req.body.bio) {
        const newUser = db.createUser({
            name: req.body.name,
            bio: req.body.bio,
        })
        // Return a 200 (OK) and the newUser.
        return res.status(201).json(newUser)
    // Else, if the name OR bio are absent, return a 400 (Bad Request) and errorMessage.
    } else if (!req.body.name || !req.body.bio) {
        return res.status(400).json({
            errorMessage: "Please provide name and bio for the user."
        })
    // Else, the server malfunctioned. Return a 500 (Server Error) and errorMessage.
    } else {
        return res.status(500).json({ 
            errorMessage: "There was an error while saving the user to the database"
        })
    }
})

// GET USERS (READ in cRud acronym)
server.get("/users", (req, res) => {

    const users = db.getUsers()

    // If the users array is found, return a 200 (OK) and the users array.
    if (users) {
        return res.status(200).json(users)
    } else {
        // Else, return a 500 (Server Error) and an errorMessage.
        return res.status(500).json({
            errorMessage: "The users information could not be retrieved." 
        })
    }
})

// GET BY USER ID (READ in cRud)
server.get("/users/:id", (req, res) => {

    const id = req.params.id
    const user = db.getUserById(id)

    // If the user is found by id, return a 200 (OK) and user object.
    if (user) {
        return res.status(200).json(user)
    // Else, if the use is not found by id, return a 400 (Bad Request) and a message.
    } else if (!user) {
        return res.status(400).json({
            message: "The user with the specified ID does not exist."
        })
    // Else, return a 500 (Server Error) and an errorMessage.
    } else {
        return res.status(500).json({
            errorMessage: "The user information could not be retrieved."
        }) 
    }
})

// PUT (UPDATE in crUd acronym)
server.put("/users/:id", (req, res) => {

    const id = req.params.id
    const user = db.getUserById(id)
    const { name, bio } = req.body

    // If the user name and bio are included in the request body
    // (and the id extant (hence <&& user> on line 85)), update the user corresponding to the id
    if (name && bio && user) {
        const updatedUser = db.updateUser(id, {
            name: req.body.name,
            bio: req.body.bio 
        })
        res.status(200).json(updatedUser)
    // Else, if the name or bio are omitted 
    // (but the id extant (hence <&& user> on line 94)), 
    // return a 440 (Bad Request) and message.
    } else if (!name && user || !bio && user) {
        res.status(400).json({
            message: "Please provide a name and bio for the user."
        })
    // Else if the id specified does not exist (in any of the above request bodies),
    // return a 404 (Not Found) and a message.
    } else if (!user) {
        res.status(404).json({
            message: "The user with the specified ID does not exist."
        })
    // Else, return a 500 (Server Error) and a message.
    } else {
        res.status(500).json({
            message: "The user information could not be modified."
        })
    }
})

// DELETE (DESTROY in cruD acronym)
server.delete("/users/:id", (req, res) => {

    const id = req.params.id
    const user = db.getUserById(id)

    // If the user if found by id, return a 204 (No Content).
    if (user) {
        db.deleteUser(id)
        return res.status(204).end()
        // Or, <res.status(204).end()>
    // Else, if the user is not found by id, 
    // return a 400 (Not Found) and a message.
    } else if (!user) {
        res.status(400).json({
            message: "The user with the specified ID does not exist."
        })
    // // Else, return a 500 (Server Error) and a message.
    } else {
        res.status(500).json({
            errorMessage: "The user could not be removed."
        })
    }
})

server.listen(8080, () => {
    console.log("The server is listening.")
})