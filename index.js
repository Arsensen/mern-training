const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const routes = require('./routers/auth.routes')
const baseRoute = require('./routers/base.routes')
const generateRoute = require('./routers/generate.routes')

const app = express()
const PORT = config.get('port')
const MongoURI = config.get('MongoURI')

app.use(express.json({ extended: true }))
app.use('/', baseRoute)
app.use('/api/auth', routes)
app.use('/api/link', generateRoute)
/* app.use('/api/links', ??????) */


async function start(){
    try {
        await mongoose.connect(MongoURI, {
            useUnifiedTopology: true,
            useCreateIndex: true,
            useNewUrlParser: true
        })
        app.listen(PORT, ()=>{
            console.log('Server started on port: ' + PORT)
        })
    } catch (error) {
        console.log('Some error: ' + error.message)
    }
}

start()