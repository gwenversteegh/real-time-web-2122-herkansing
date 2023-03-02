# 🎵 Triva music quizzz
<img width="49%" alt="Schermafbeelding 2022-05-10 om 14 37 41" src="https://user-images.githubusercontent.com/70577898/167631100-474d2a57-5a38-4153-a075-a9e582cabf50.png">  <img width="49%" alt="Schermafbeelding 2022-05-10 om 14 38 05" src="https://user-images.githubusercontent.com/70577898/167631113-ae40b0b0-0128-44b9-ac50-c55d8c623b3f.png">  <img width="49%" alt="Schermafbeelding 2022-05-10 om 14 41 06" src="https://user-images.githubusercontent.com/70577898/167631128-b35cdd35-a4fe-4294-9b7f-88d065c0cc76.png">

## Three Concepts
<img width="49%" alt="C1" src="https://user-images.githubusercontent.com/70577898/167667040-89cc3a62-e4e0-45bf-97e1-2e6e77488a51.png"><img width="49%" alt="C2" src="https://user-images.githubusercontent.com/70577898/167667046-57688ba4-2b58-4820-ae69-3785c38728e4.png"><img width="49%" alt="C3" src="https://user-images.githubusercontent.com/70577898/167667056-94e5ee5a-acb2-47bb-bd93-e6ff5ef13174.png">

### Chosen Concept: Trivia music quiz

## :fountain: Wishlist

#### Must have
:white_check_mark: See who is online <br>
:white_check_mark: Enter a (user)name via Sockets.io <br>
:white_check_mark: Fill in trivia questions form API<br>
:white_check_mark: See how many questions are answered correctly <br>

#### Should have
:white_check_mark: Answered question can not be adjusted <br>
:white_check_mark: Results list <br>
:white_check_mark: Remember who are online<br>
- [ ] Results list in order
- [ ] Remember the ranking list
- [ ] Show right answer if the wrong one is answered


#### Could have
- [ ] Question shown one by one
- [ ] See a leaderboard before you are doing the quiz yourself.

#### Want to have
- [ ] Rankinglist in a database (longer memory)
- [ ] When people have the same amount of right asnwers, the person who finished the fastest wins. (timing function)




## 🕹️ What does this Web App do?
In this Web App you can make a music quiz with trivia questions. There are a view things I would like to highlight.

### Username
At the beginning, the user is asked to fill in their name. This can be any name they want: their real name, a nickname or a made up name. Once the user filled in their name, the questions are shown and they can start making the quiz. 

### Online 
Once the user filled in their name, the user is online through the [name socket](#name-event). All users have a list of online users that will be updated everytime someone starts their game.
The users can also see users that logged in before them. I did this by storing them in an 'online'-array. I push the filled in name and socket-id in this array. 
The user also sees it, when someone leaves the website. This is done with the [user left socket](#user-left-event)


### Quiz
#### Randomify answer order
At first, the first answer was always the right one, because I render the page with EJS. This is not very nice for the quiz so I wrote a function that randomizes the order. This way you can not know which answer is the right one.
```
const options = document.querySelectorAll(".quiz ol li form > div")
function randomizeAnswers(){
  options.forEach((answers)=>{
    for (var i = answers.children.length; i >= 0; i--) {
      answers.appendChild(answers.children[Math.random() * i | 0]);
    }
  })
}
randomizeAnswers()
```

#### Show if the answer is right or not
When you click on an answer, you directly see if it is the right answer or not. The user sees a green or a red answer.<br>
I did not have enough time to show the correct answer if the wrong one is answered. It would be nice for the users to see which one is right.

### Result/ranking list
#### Count the right answers
Every right answer (which is a radio buttons) has a class 'true'. With querySelectorAll, i select all the checked radiobuttons WITH the class 'true'. This returns a Nodelist, which is kind of an array, so the length of this list is the amount of good answers. This number is rendered on the page.

#### Update ranking list
The quiz has 10 questions. So when 10 questions are filled in, the quiz is over and the ranking list will be updated with the [ranking socket](#ranking-event).<br> 
I did not have enough time to order the ranking-list. Of course this is kind of important for a ranking list. 😅



## ❓ About the Open Trivia API
For this project I used the [open Trivia API](https://opentdb.com/api_config.php). This is a super simple API to use! Since it is an open API, you do not need an API key. The only thing you have to do is, fill in a form with question about what kind & how many question you want to fetch. Once you filled in that form, the site generates a link for you. How nice is that?! 😄

### Construction of the API
The [link](https://opentdb.com/api.php?amount=10&category=12&difficulty=easy) that i fetch, fetches 10 easy music questions. You can find the data of the questions in the **results** array. 
```
{
  "response_code": 0,
  "results": []
}
```
The question-data is stored in objects.
There are **2 kinds of questions**: true/false-quetions & ABCD-questions

#### A true/false-question
``` 
{
  "category": "Entertainment: Music",
  "type": "boolean",
  "difficulty": "easy",
  "question": "The music video to The Buggle&#039;s &quot;Video Killed the Radio Star&quot; was the first music video to broadcast on MTV.",
  "correct_answer": "True",
  "incorrect_answers": [
    "False"
    ]
  }
```

#### An ABCD-question
```
{
      "category": "Entertainment: Music",
      "type": "multiple",
      "difficulty": "easy",
      "question": "Which member of the Foo Fighters was previously the drummer for Nirvana?",
      "correct_answer": "Dave Grohl",
      "incorrect_answers": [
        "Taylor Hawkins",
        "Nate Mendel",
        "Chris Shiflett"
      ]
    }
```

### Data model Open Trivia API
<img width="1089" alt="Schermafbeelding 2022-05-10 om 16 10 25" src="https://user-images.githubusercontent.com/70577898/167649389-42734419-b9ae-4b30-8fda-9206669be2dd.png">


## :arrows_counterclockwise: Data Lifecycle Diagram
<img width="1116" alt="Schermafbeelding 2022-05-10 om 16 10 00" src="https://user-images.githubusercontent.com/70577898/167649187-bbd67375-37fc-4dc8-9667-b4a7785fd148.png">

## ⏱️ Real-Time Events (sockets)
### Name event
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
  //add item to online-list  
  names.insertAdjacentHTML('beforeend', 
  `<li id="text${user.id}"> 
      <p>${user.username}</p>
  </li>`)


  //adds item to ranking
  rankingList.insertAdjacentHTML('beforeend', 
  `<li id="${user.id}"> 
      <p>${user.username}</p>
      <p><span>Still playing...</span>/10</p>
  </li>`)
})

```

### Ranking event
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
    //update waarde in ranking lijst
    let rank = ranking.amount
    result.innerHTML= `${rank}`
})
```

### User left event
#### server.js
```
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
```
#### script.js
```
socket.on('user left', user => {
  console.log(user.id);
  document.querySelector(`#text${user.id}`).remove();
})
```

## 📦 Used Packages
- [EJS](https://www.npmjs.com/package/ejs)
- [Node-fetch](https://www.npmjs.com/package/node-fetch)
- [express](https://www.npmjs.com/package/express)
- [socket.io](https://www.npmjs.com/package/socket.io)
- [node-dev](https://www.npmjs.com/package/node-dev)

## ⤵️ Install
Install and use this repo in a view simple steps
1. Clone this repo with ``git clone https://github.com/Sophievanderburg/real-time-web-2122.git``
2. Install all the used packages with ``npm install``
3. Start the server with ``npm run dev``
4. Open ``http://localhost:4242/`` in your favourite browser <br>
Good luck! 🍀

## ℹ️ Sources
- Example of a [sockets chat](https://github.com/ju5tu5/barebonechat) from Justus Sturkenboom
- Sources of the course [real time web](https://github.com/cmda-minor-web/real-time-web-2122) @CMD minor: Webdesign & -development
