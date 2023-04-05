// 농약 데이터 파일 가져오기
const url = 'https://raw.githubusercontent.com/chanyoung8282/pesticide-quiz/main/pesticide01.xlsx'; // 사용자명에는 본인의 GitHub 아이디를 입력하세요
const workbook = XlsxPopulate.fromFileAsync(url).then(workbook => {
  // 엑셀 시트 가져오기
  const sheet = workbook.sheet("Sheet1");

  // 퀴즈 시작
  function startQuiz() {
    // 문제 수 입력 받기
    let numQuestions = parseInt(prompt("몇 문제를 풀까요? (10~100, 10의 배수)", "10"));

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

 

