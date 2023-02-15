const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.send('hahaha')
})

app.listen('8000', () => {
    console.log('8000');
    
})