// script.js

const form = document.querySelector('form');
const choices = Array.from(document.querySelectorAll('.choice input[type="radio"]'));
const answerContainer = document.querySelector('.answer');
const btn = document.querySelector('.btn');

let currentQuestion = 0;
let score = 0;

const showQuestion = (question) => {
  document.querySelector('.question').textContent = question['문제'];
  const choiceLabels = Array.from(document.querySelectorAll('.choice label'));
  choiceLabels.forEach((label, index) => {
    label.textContent = question[`선택지${index+1}`];
  });
}

const showAnswer = (isCorrect, correctAnswer) => {
  answerContainer.innerHTML = '';
  const p = document.createElement('p');
  p.textContent = isCorrect ? '정답입니다!' : `틀렸습니다. 정답은 ${correctAnswer}입니다.`;
  p.classList.add(isCorrect ? 'correct' : 'incorrect');
  answerContainer.appendChild(p);
}

const handleChoiceChange = () => {
  const checkedChoice = choices.find(choice => choice.checked);
  if (!checkedChoice) {
    btn.disabled = true;
    return;
  }
  btn.disabled = false;
}

const handleFormSubmit = (event) => {
  event.preventDefault();
  const checkedChoice = choices.find(choice => choice.checked);
  const answer = checkedChoice.value;
  const question = questions[currentQuestion];
  const isCorrect = answer === question['정답'];
  if (isCorrect) {
    score++;
  }
  showAnswer(isCorrect, question['정답']);
  btn.textContent = currentQuestion === questions.length - 1 ? '결과 보기' : '다음 문제';
}

const handleBtnClick = () => {
  if (currentQuestion === questions.length - 1) {
    const totalScore = Math.round(score / questions.length * 100);
    const message = `총점: ${score} / ${questions.length}\n백분율 점수: ${totalScore}점`;
    alert(message);
    return;
  }
  currentQuestion++;
  showQuestion(questions[currentQuestion]);
  answerContainer.innerHTML = '';
  btn.disabled = true;
  btn.textContent = '제출';
}

choices.forEach(choice => choice.addEventListener('change', handleChoiceChange));
form.addEventListener('submit', handleFormSubmit);
btn.addEventListener('click', handleBtnClick);

let questions = [];

fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
   
