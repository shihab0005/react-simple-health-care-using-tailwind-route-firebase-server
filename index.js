const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors")
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

//middlewire
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@studentmanagement.qkja8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const database = client.db("HealthCareInfo");
        const doctorsInfoCollection = database.collection("DoctorsInfo");
        const appointInfoCollection = database.collection("AppointInfo");

        //get Api
        app.get("/doctorsInfo", async (req, res) => {
            const cursor = doctorsInfoCollection.find({});
            const doctorsInfo = await cursor.toArray();
            res.send(doctorsInfo)
        })

        //book appointment
        app.post("/bookAppointment", async (req, res) => {

            const appointment = req.body;
            const result = await appointInfoCollection.insertOne(appointment)
            console.log("Book Appiontment", req.body);
            res.json(result)
        });
        //display all appointment of a user

        app.get("/bookAppointment", async (req, res) => {
            const query = appointInfoCollection.find({});
            const appointInfo = await query.toArray()
            res.send(appointInfo);
        });

        //delete single appointment;
        app.delete("/bookAppointment/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await appointInfoCollection.deleteOne(query);
            console.log("deleted id is :", id)
            res.json(result)
        })


    } finally {
        //await client.close();
    }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send("from Health care server")
})

app.listen(port, () => {
    console.log("App is running port ", port)
})