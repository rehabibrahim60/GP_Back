import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './DB/dbConnection.js'
dotenv.config()

const app = express()
const port = process.env.PORT

await connectDB()

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${process.env.PORT}!`))