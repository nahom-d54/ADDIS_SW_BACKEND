const express = require('express')
const dotenv = require("dotenv")
const insertDefaultGenre = require('./utils/insertDefaultGenre')
const musicRouter = require('./routes/music/index')
const userRouter = require('./routes/user/index')
const createConnection = require('./db/db')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors');

dotenv.config()
createConnection()
insertDefaultGenre()

const app = express()

app.use(cors({
  origin: true,
  credentials: true,
}))
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())


app.use('/uploads',express.static('uploads'))
app.use('/',musicRouter)
app.use('/user',userRouter)


app.listen(3000,() => {
    console.log("server started at port 3000");
})