const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

const app = express()
const Routes = require("./routes/route.js")

const PORT = process.env.PORT || 5000

dotenv.config();

app.use(express.json({ limit: '10mb' }))
//app.use(cors())

app.use(cors({
    origin: ['http://192.168.0.102:3000', 'http://localhost:3000','https://webshop-client-kp2x.onrender.com'], // cors allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))

app.use('/', Routes);

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})