const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./utils/connectDB.js')

dotenv.config()

const PORT = process.env.PORT
const app= express()
app.use(express.json())
app.use(cors())

app.listen(PORT, async ()=>{
    await connectDB();
    console.log(`Server running on ${PORT}`)
})
