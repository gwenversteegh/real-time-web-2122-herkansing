# The big animal quiz

<img width="1434" alt="Screenshot 2023-10-16 at 11 34 39" src="https://github.com/gwenversteegh/real-time-web-2122-herkansing/assets/70900763/e8b46652-2ce0-49d0-9541-bf48296da0f2">
<img width="1434" alt="Screenshot 2023-10-16 at 11 34 59" src="https://github.com/gwenversteegh/real-time-web-2122-herkansing/assets/70900763/40ff0c70-af85-44c4-85c9-67e821cadfc0">
<img width="1434" alt="Screenshot 2023-10-16 at 11 37 39" src="https://github.com/gwenversteegh/real-time-web-2122-herkansing/assets/70900763/3e591e6c-a162-47d0-8bff-a92b25418e2f">

## sketches / concepts

### Guess the Pokemon
<img width="191" alt="Screenshot 2023-10-16 at 13 23 08" src="https://github.com/gwenversteegh/real-time-web-2122-herkansing/assets/70900763/1e8adc1f-fef8-4b05-a743-b3e2c9d49aa2">

You get a zoomed in picture and you need to guess what pokemon it is.

### animal quiz
<img width="246" alt="Screenshot 2023-10-16 at 13 28 33" src="https://github.com/gwenversteegh/real-time-web-2122-herkansing/assets/70900763/90a54d00-cc30-4f6e-8bba-e8a4054f2bb0">

You get some difficult questions about animals you've never heard of before.

### To do list
<img width="247" alt="Screenshot 2023-10-16 at 13 31 39" src="https://github.com/gwenversteegh/real-time-web-2122-herkansing/assets/70900763/5488b6bf-9895-421d-ba8e-7458e4b49c27">

You can make a to do list with friends or with your project group, so you don't forget a thing!


## Moscow method

### Must have
- [x] fill in questions and answers from an API 
- [x] See who is online
- [x] Enter a username
- [x] See the result (how many answers are correct)

### Should have
- [x] Only answer one time, you can't adjust the answers
- [x] Result list
- [x] Always see who is online
- [ ] Ranking in order

### Could have
- [ ] See the highscore before you begin
- [ ] See during the quiz how many questions you answered correctly

### Want to have
- [ ] The option to see your mistakes and what the right answers would be
- [ ] How fast you where

## functions
In this Web App you can answer difficult questions about animals. These are some of the functions:

### Name
You can add your name before you start. When you added your name, you can start the quiz and you can see the other names from people who are online.

### Online
You can see who is current online and making the quiz. Everytime someone new adds his or her name, the list wil be updated. 
I did this by storing them in an 'online'-array. I push the filled in name and socket-id in this array. The user also sees it, when someone leaves the website. 
This is done with the user left socket.

### Quiz
It was important that you can only answer the question one time and that you can't keep trying untill you find the right answer. To do this I used this function:
```
function disableForm(){
  questionForms.forEach((form)=>{
    form.addEventListener('change', event => {
      form.style.setProperty('pointer-events', 'none')
    })
  })
}
disableForm()
```

It was also important to see if you answered the question right or wrong. So if you answered correctly, the answers turned green, if not, the answer turned red.

### Result
Every right answer (which is a radio buttons) has a class 'true'. With querySelectorAll, i select all the checked radiobuttons WITH the class 'true'. 
This returns a Nodelist, which is kind of an array, so the length of this list is the amount of good answers. This number is rendered on the page.

## API
How I made the API:
https://opentdb.com/api_config.php


The API that I fetch is an open API and has different animal question in it. It is easier to use an open API because if you do, you don't need an API key. The site I used was very simple.
You filled in, how many questions you wanted, about what, how hard and what kind of answers you want. One click on the button and you have an API.

API link:
https://opentdb.com/api.php?amount=20&category=27&difficulty=medium&type=multiple 

## Data model
<img width="216" alt="Screenshot 2023-10-16 at 12 38 30" src="https://github.com/gwenversteegh/real-time-web-2122-herkansing/assets/70900763/ba3f50af-e839-4a86-aa2f-a92ef49328ba">

## Data Lifecycle Diagram
<img width="393" alt="Screenshot 2023-10-16 at 13 09 57" src="https://github.com/gwenversteegh/real-time-web-2122-herkansing/assets/70900763/15ec6297-6cb2-4fa8-9ad6-80e93630db32">

## Real time events

### Name

#### server.js
```
 socket.on('name', (name) => {
    let object = {username: name , id: socket.id}
    online.push(object)
    io.emit('name', {username: name , id: socket.id})
  })
```
#### script.js
```
socket.on('name', user => {
  //adds name to online-list  
  names.insertAdjacentHTML('beforeend', 
  `<li id="text${user.id}"> 
      <p>${user.username}</p>
  </li>`)

  //adds name to ranking
  rankingList.insertAdjacentHTML('beforeend', 
  `<li id="${user.id}"> 
      <p>${user.username}</p>
      <p><span>${amountGoodAnswers} </span>/20</p>
  </li>`)
})
```
### Ranking

#### server.js
```
socket.on('ranking', (ranking) => {
    io.emit('ranking', {id: socket.id, amount: ranking})
  })
```
#### script.js
```
socket.on('ranking', ranking => {
    let result = document.querySelector(`#${ranking.id} p:last-of-type span`)
    //update ranking order
    let rank = ranking.amount
    result.innerHTML= `${rank}`
})
```
### User left

#### server.js
```
socket.on('disconnect', () => {
    io.emit('user left', {id: socket.id})

    online = online.filter(element => {
      if(element.id !== socket.id) {
        // add to new array
        return true;
      } else {
        // Filter from new array
        return false;
      }
    })
    console.log('user disconnected')
  })
```
#### script.js
```
socket.on('user left', user => {
  console.log(user.id);
  document.querySelector(`#text${user.id}`).remove();
})

```

## packages 
- EJS
- Node-fetch
- Express
- Socket.io
- Node-dev

## How to use?
- Clone this repo with git clone https://github.com/gwenversteegh/real-time-web-2122-herkansing.git  
- Install all the used packages with npm install
- Start the server with npm start
- Open http://localhost:9876/ in your browser 
