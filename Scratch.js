const express = require("express")
const fetch = require("node-fetch")
import fetch from "node-fetch";
const redis = require("redis")

// redis[s]://[[username][:password]@][host][:port][/db-number]:
// url: 'redis://alice:foobared@awesome.redis.server:6380'

await client.set(username, repos)
client.set(key, value, 'EX', 60 * 60 * 24, callback);

// This code doesn't work
// await client.get(username, (err, data) => {
//     if (err) {
//         console.log(err)
//         return
//     }
//     if (data != null) {
//         console.log(data)
//         res.send(getResponse(username, data))
//     } else {
//         next()
//     }
// })
