const request = require("supertest")
const test = require("jest")

const app = require("./index")

describe("test if articles are being saved", ()=> {

    test("POST /submit" , (done) =>{
   
     request(app)
     .post("/submit")
     .expect("content-Type", /json/)
     .send ({
        title: "title of the article",
        description : "description of the article",
        tags: ["tags of the article"],
        body: "body of the article"
     })

     .expect(201)
    } )
})