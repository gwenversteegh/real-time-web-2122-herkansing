/* https://socket.io/get-started/chat */
const express = require('express')
const app = express()
const fetch = require('node-fetch')
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const port = process.env.PORT || 9876

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(path.resolve('public')))

app.get("/", renderPagina)

let online = []

function renderPagina (req, res){
  fetch(`https://opentdb.com/api.php?amount=20&category=27&difficulty=medium&type=multiple`)
  .then(function(response){
    return response.json()
  })
  .then((jsonData) =>{
    res.render('index', {
      data: jsonData.results,
      online: online,
    })
  })
  .catch((err)=>{
    res.render('error', {
      pageTitle: "Error"
    })
  })
}



io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('name', (name) => {
    let object = {username: name , id: socket.id}
    online.push(object)
    io.emit('name', {username: name , id: socket.id})
  })

  socket.on('ranking', (ranking) => {
    io.emit('ranking', {id: socket.id, amount: ranking})
  })

  socket.on('disconnect', () => {
    io.emit('user left', {id: socket.id})

    online = online.filter(element => {
      if(element.id !== socket.id) {
        // Voeg 'm toe aan de nieuwe array
        return true;
      } else {
        // Filter 'm uit de nieuwe array
        return false;
      }
    })
    console.log('user disconnected')
  })
})

http.listen(port, () => {
  console.log('listening on port ', port)
})
