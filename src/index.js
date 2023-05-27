const express=require('express');
const morgan = require('morgan');
// make app

const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended:true}))

app.get('/', (req, res) => {
    res.send({
        message:"Everything is fine"
    })
});

//client error handling

app.use((req, res,next) => {
    res.status(404).json({message:"Route not found"})
    next();
})

//server error handling

app.use((err,req, res, next) => {
    if(err){
        res.status(500).send({message:"Server error"})
    }
    next();
})
// listen on port 5000

app.listen(5000,()=>{
    console.log('listening on port 5000')
});