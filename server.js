import express from "express"
import fetch from "node-fetch";
import redis from "redis"


const PORT = process.env.PORT || 3000
const REDIS_PORT = process.env.REDIS_PORT || 6379
const EX_TIME = 120
const url = `redis://localhost:${REDIS_PORT}`

const client = redis.createClient({
    url
})

client.on('error', (err) => {
    console.log('Redis Client Error', err)
})

await client.connect()

const app = express()

app.get("/", (req, res) => {
    res.json({
        message: "Hi from Server"
    })
})

// utility function
function getResponse(username, repos) {
    return `<h2>${username} has ${repos} GitHub repos</h2>`
}

// middleware
async function cache(req, res, next) {
    const {username} = req.params
    const data = await client.get(username)
    if (data != null) {
        // data is in cache
        res.send(getResponse(username, data))
        console.log(`fetched ${username} repos from cache`)
    } else {
        // data is not in cache, so call next()
        // so getRepos can get it from GitHub and put it in cache
        next()
    }
}

async function getRepos(req, res, next) {
    try {
        const {username} = req.params
        const url = `http://api.github.com/users/${username}`
        const response = await fetch(url)
        const data = await response.json()
        const repos = data.public_repos

        // await client.set(username, repos, 'EX', 60 * 60)
        await client.set(username, repos, {
            EX: EX_TIME,
            NX: true
        })
        // response back to client
        const result = `<h2>${username} has ${repos} GitHub repos</h2>`
        res.send(result)
        console.log(`fetched ${username} repos from github.com`)
    } catch (err) {
        console.error(err)
        res.status(500)
    }
}

app.get("/repos/:username", cache, getRepos)

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`)
})
