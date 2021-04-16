
// import express
const express = require("express");
const app = express();

// configure express to accept data from the client as JSON format
app.use(express.json())


// specify the port that your server will run on
const HTTP_PORT = process.env.PORT || 8080;

// 
let upcomingMovies = [
    {
        "id": 1,
        "name":"Fast and Furious 9",
        "desc":"The last installement of the Fast and Furious franchaise! we hope!"
    },
    {
        "id": 2,
        "name":"Chaos Walking",
        "desc":"Surivial movie, zombies, apocolyse"
    },
    {
        "id":3,
        "name":"Mortal Kombat",
        "desc":"A remake of the classic 1995 film, based on the seminal video game series"
    },
    {
        "id":4,
        "name":"Black Widow",
        "desc":"The latest addition to the MCU, which seems to have been COMING FOREVERRRRR"
    }
]


// 5a. Setup an endpoint for the user to be able to get all the movies from the db
// 5b. Your endpoint should respond to GET requests
app.get("/api/movies", (req, res) => {
    // 5c/ When you receive a request, return the list of movies
    // 5d/ Reply with status code 200 (defult provided by express)
    res.send(upcomingMovies)
})

// /api/movies/3
// --> should return movie with id 3
app.get("/api/movies/:movieID", (req,res) => {
    // 1. retrieve the movieID in the url    
    console.log(req.params)
    let id = parseInt(req.params.movieID);
    
    // JAVASCRIPT ALWAYS SETS IT SPARAMETERS AS STRINGS!!!!!!
    // but my data store has its ids as integers !!!


    // 2. Search your list of movies for a movie that matches that id
    // get a list of all the parameters in your request
    for (let i = 0; i < upcomingMovies.length; i++) {
        let movie = upcomingMovies[i]
        if (movie.id === id) {
                // 3. if you can find it, then return it
            return res.send(movie)
        }
    }

    // 4. if you cannot find it, then return an error message & appropriate status code
    res.status(404).send({msg:`Sorry, could not find movie with id: ${id}`})    
})

// Endpoint to insert a book
app.post("/api/movies", (req, res) => {
    // 1. GET the body of the request (body of the request = contain the data the user want sto insert)
    let movieToInsert = req.body
    console.log(`User wants to insert this data: ${movieToInsert.title}`)

    // error handling
    // check to see if the body contains a title and descr
    if ("title" in req.body && "desc" in req.body) {
        // 2. INSERT it into the data store (append it to my list of movies)
        upcomingMovies.push(movieToInsert)
        // 3. RESPOND with a success / error
        res.status(201).send({"msg":"Movie successfully inserted!"})
    }
    res.status(401).send({"msg":"Sorry, you are missing a movie title or desription in your json payload"})    
})


// update
app.put("/api/movies/:movieID", (req,res) => {
    // 1. get id from the URL params
    const movieIdFromUser = parseInt(req.params.movieID)
    // 2. get the body from the request
    const movieData = req.body

    console.log(`User wants to update movie id #: ${movieIdFromUser}`)
    console.log(JSON.stringify(movieData))

    if (req.body.hasOwnProperty("title") === false || req.body.hasOwnProperty("desc") === false) {
        res.status(422).send({"msg":`You are missing either a title or description in your request.`})
        return
    }

    // 3. Search for the requested id and retrieve it from the data source
    let pos = undefined
    for (let i = 0; i < upcomingMovies.length; i++) {
        if (upcomingMovies[i].id === movieIdFromUser) {
            // getting the position in the array of the specified movie
            pos = i
            break
        }
    }

    if (pos === undefined) {
        // we couldn't find this id in the data source
        res.status(404).send({"msg":`Could not find movie with id of ${movieIdFromUser}`})
        return
    }
    // 4. Update the datastore
    upcomingMovies[pos] = movieData
    res.send(`Success, movie updated: ${JSON.stringify(upcomingMovies[pos])}`);
})

// delete
app.delete("/api/movies/:movieID", (req,res) => {
    // 1. Get the movie id
    const movieIdFromUser = parseInt(req.params.movieID)
    
     // 2. Search for the requested id and retrieve it from the data source
     let pos = undefined
     for (let i = 0; i < upcomingMovies.length; i++) {
         if (upcomingMovies[i].id === movieIdFromUser) {
             // getting the position in the array of the specified movie
             pos = i
             break
         }
     }

    // 3. if movie not found, then return an error
    if (pos === undefined) {
        // we couldn't find this id in the data source
        res.status(404).send({"msg":`Could not find movie with id of ${movieIdFromUser}`})
        return
    }

    // 4. otherwise, delete it
    // .splice removes an item at a specific position, see here for more details:
    // https://www.w3schools.com/jsref/jsref_splice.asp
    upcomingMovies.splice(pos, 1)
    res.send({"msg":`Deleted movie with id of ${movieIdFromUser}`})
})



// list of url endpoints that your server will respond to
app.get("/", (req, res) => {
    // JSON , XML
    // All data sent to the API endpoint, are sent in JSON format
    // All replies sent by the server are sent in JSON Format    
    res.status(418).send({"name":"Peter", "age":99});
});

 
 
// start the server and output a message if the server started successfully
const onHttpStart = () => {
 console.log(`Server has started and is listening on port ${HTTP_PORT}`)
}
app.listen(HTTP_PORT, onHttpStart);

