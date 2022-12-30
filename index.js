const config = require('./config/dev')

const express = require('express')
const app = express()
const port = config.port

const mongoose = require('mongoose')
mongoose.set('strictQuery',true)
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))



app.get('/', (req, res) => res.send("Hello World! 안녕하세요"))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))