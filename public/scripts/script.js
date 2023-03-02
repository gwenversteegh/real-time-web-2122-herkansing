let socket = io()

const nameSection = document.querySelector(".index")
const nameForm = document.querySelector("section > form")
let input = document.querySelector('#name')


const quizSection = document.querySelector(".quiz")
const questionForms = document.querySelectorAll(".form")

let goodAnswers
let amountGoodAnswers

const rankingSection = document.querySelector(".ranking")
const rankingList = document.querySelector(".ranking > ol")
const counter = document.querySelector(".ranking > p span")

let names = document.querySelector('header ul')

// Go to questions when name is filled in
nameForm.addEventListener('submit', event => {
  event.preventDefault()
  if (input.value) {
    socket.emit('name', input.value)
    input.value = ''
    nameSection.classList.add("onzichtbaar")
    quizSection.classList.remove("onzichtbaar")
  }
})

socket.on('name', user => {
  //adds item to online-list  
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

socket.on('ranking', ranking => {
    let result = document.querySelector(`#${ranking.id} p:last-of-type span`)
    //update waarde in ranking lijst
    let rank = ranking.amount
    result.innerHTML= `${rank}`
})

socket.on('user left', user => {
  console.log(user.id);
  document.querySelector(`#text${user.id}`).remove();
})



/* ---------------------------------------------------------------------------------------------------- */
function questionFormActions (){
  questionForms.forEach((form)=>{
    form.addEventListener('change', countGoodAnswers)
    form.addEventListener('change', toRanking)
  })
}
questionFormActions()

// randomize order of possible answers 
const options = document.querySelectorAll(".quiz ol li form > div")
function randomizeAnswers(){
  options.forEach((answers)=>{
    for (var i = answers.children.length; i >= 0; i--) {
      answers.appendChild(answers.children[Math.random() * i | 0]);
    }
  })
}
randomizeAnswers()

// disable form after answer is filled in
function disableForm(){
  questionForms.forEach((form)=>{
    form.addEventListener('change', event => {
      form.style.setProperty('pointer-events', 'none')
    })
  })
}
disableForm()

// count the amount of good answers
function countGoodAnswers(){
  goodAnswers = document.querySelectorAll('input[type="radio"].true:checked')
  amountGoodAnswers = goodAnswers.length
  counter.innerHTML = amountGoodAnswers
}

// Go to ranking if all questions are answered
function toRanking (){
  let checkedInputs = document.querySelectorAll('input[type="radio"]:checked')
  let checkennn = checkedInputs.length
  if( checkennn > 19){
    socket.emit('ranking', amountGoodAnswers)
    quizSection.classList.add('onzichtbaar')
    rankingSection.classList.remove('onzichtbaar')
  }
}