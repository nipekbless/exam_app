const express = require("express")
const request = require ("supertest")
const blogroute = require ("../router/BlogRoute")

const app = express()

app.use( express.json())

app.use("Api/", blogroute)

describe("integration test for the blog API", ()=>{

it('GET Api/blogs - success- get all the blogs', async()=>{

    const {body, statusCode}= await request(app).get("/Api/blogs")

       expect(body).toEqual(
        

             expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String),
                description: expect.any(String),
                read_count: expect.any(Number),
                reading_time: expect.any(Number),
                tags: expect.any([String]),
                body: expect.any(String),
                state: expect.any(String)
            })
    
    )

    expect(statusCode).toBe(201)
})

})