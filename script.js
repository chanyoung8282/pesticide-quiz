// 농약 데이터 파일 가져오기
const url = 'https://raw.githubusercontent.com/chanyoung8282/pesticide-quiz/main/pesticide01.xlsx'; // 사용자명에는 본인의 GitHub 아이디를 입력하세요
const workbook = XlsxPopulate.fromFileAsync(url).then(workbook => {
  // 엑셀 시트 가져오기
  const sheet = workbook.sheet("Sheet1");

  // 퀴즈 시작
 function startQuiz() {
  var questionCount = parseInt(document.getElementById("question-count").value);
  if (questionCount < 10 || questionCount > 100 || questionCount % 10 !== 0) {
    alert("문제 개수는 10에서 100 사이의 10의 배수로 입력해주세요.");
    return;
  }
  var quiz = generateQuiz(pesticideData, questionCount);
  displayQuiz(quiz);
}

    // 유효성 검사
    if (isNaN(numQuestions) || numQuestions < 10 || numQuestions > 100 || numQuestions % 10 !== 0) {
      alert("입력한 값이 유효하지 않습니다. 10~100 중 10의 배수로 다시 입력해주세요.");
      startQuiz();
      return;
    }

    // 문제 출제
    const questions = [];
    while (questions.length < numQuestions) {
      const rowNumber = Math.floor(Math.random() * (sheet.usedRange().bottomRightCell().rowNumber() - 1)) + 2;
      const pesticide = sheet.row(rowNumber).cell("A").value().toString();
      const category = sheet.row(rowNumber).cell("B").value().toString();
      const choices = ["제초제", "살충제", "살균제"];
      const index = Math.floor(Math.random() * 3);
      const correctChoice = choices[index];
      const wrongChoices = choices.filter((_, i) => i !== index);
      questions.push({
        question: `${pesticide}은(는) ${correctChoice}입니다.`,
        choices: shuffleArray([correctChoice, wrongChoices[0], wrongChoices[1]])
      });
    }

    // 퀴즈 풀이
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      const answer = prompt(`${i + 1}. ${questions[i].question}\n\n1. ${questions[i].choices[0]}\n2. ${questions[i].choices[1]}\n3. ${questions[i].choices[2]}`);
      if (answer === null) {
        alert("퀴즈를 종료합니다.");
        return;
      }
      const choice = parseInt(answer);
      if (isNaN(choice) || choice < 1 || choice > 3) {
        alert("입력한 값이 유효하지 않습니다. 1~3 사이의 값을 입력해주세요.");
        i--;
        continue;
      }
      if (questions[i].choices[choice - 1] === questions[i].choices[0]) {
        score++;
      }
    }

    // 결과 출력
    alert(`퀴즈를 모두 풀었습니다!\n당신의 점수는 ${score}/${numQuestions}입니다.`);
  }

 // 농약 퀴즈 데이터 로드
async function loadQuizData() {
  const response = await fetch("pesticide01.csv");
  const csvText = await response.text();
  const data = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  return data.data;
}

// 중복을 허용하지 않고 무작위로 정해진 개수의 인덱스를 반환하는 함수
function generateRandomIndexes(length, count) {
  const indexes = new Set();
  while (indexes.size < count) {
    const randomIndex = Math.floor(Math.random() * length);
    indexes.add(randomIndex);
  }
  return Array.from(indexes);
}

// 퀴즈 데이터에서 지정된 개수만큼 무작위로 문제를 선택하는 함수
async function selectQuizQuestions(count) {
  const quizData = await loadQuizData();
  const indexes = generateRandomIndexes(quizData.length, count);
  const questions = indexes.map((index) => quizData[index]);
  return questions;
}

// 퀴즈 폼을 생성하는 함수
function createQuizForm(questions) {
  const form = document.createElement("form");
  questions.forEach((question, index) => {
    const questionText = question["농약명칭"];
    const answerOptions = [
      question["제초제"],
      question["살충제"],
      question["살균제"],
    ];
    const randomOptions = answerOptions.sort(() => Math.random() - 0.5);
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.innerText = `문제 ${index + 1}: ${questionText}`;
    fieldset.appendChild(legend);
    randomOptions.forEach((option) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `question-${index}`;
      input.value = option;
      label.appendChild(input);
      label.append(` ${option}`);
      fieldset.appendChild(label);
    });
    form.appendChild(fieldset);
  });
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.innerText = "제출";
  form.appendChild(submitButton);
  return form;
}

// 퀴즈 결과를 생성하는 함수
function createQuizResults(questions, answers) {
  let correctCount = 0;
  const results = document.createElement("div");
  results.classList.add("results");
  questions.forEach((question, index) => {
    const isCorrect = question["분류"] === answers[index];
    const result = document.createElement("div");
    result.classList.add("result");
    result.classList.add(isCorrect ? "correct" : "incorrect");
    const resultText = isCorrect ? "정답" : "오답";
    result.innerHTML = `<strong>문제 ${index + 1}</strong>: ${question["농약명칭"]} (${resultText})`;
    results.appendChild(result);
    if (isCorrect) {
      correctCount++;
    }
  });
  const resultText = `${questions.length}문제 중 ${correctCount}문제를 맞추셨습니다.`;
  const score = document.createElement("p");
  score.innerText = resultText;
  results.insertBefore(score, results.firstChild);
  return results;
}


