const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
app.use(cors())
const cookiesession = require('cookie-session')
const authrouter = require('./routes/auth')
//routers
const hotelrouter = require('./routes/hotelRoutes.js');
const bookingrounter = require('./routes/bookingRoutes')

//requiring local stuff

const connectdb = require('./dbconfig')
//adding cookie session
app.use(cookiesession({
    name:'Session', 
    maxAge:24*60*60*1000,
    keys:[process.env.COOKIE_KEY_1,process.env.COOKIE_KEY_2]
}))
//addons

app.use(express.json())
app.use(express.static(path.join(__dirname,'..','client'))) 
app.use('/',hotelrouter)
app.use('/',bookingrounter)
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','client','index.html'))
})
app.use('/auth',authrouter)

// app.get('/auth/status',(req,res)=>{
//     res.send({isloogedin:false})
// })
// app.get('/auth/useremail',(req,res)=>{
//     res.send({
//         email:'shukla.pratham2003@gmail.com',
//     })
// })

app.listen(3000,async ()=>{
    await connectdb();
    console.log('server is listening...')
})

