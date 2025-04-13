

const FeedbackScreen = () => {
  const answers: string[][] = JSON.parse(localStorage.getItem('userAnswers') || '[]');
  const questions = JSON.parse(localStorage.getItem('allQuestions') || '[]');

  if (!answers.length || !questions.length) {
    return <p className="text-red-600">Error: No quiz data found. Please complete the quiz first.</p>;
  }

  const score = answers.reduce((acc, curr, idx) => {
    const correct = questions[idx].correctAnswer;
    // Check if the user's answers match the correct answers (order-insensitive)
    const isCorrect = correct.sort().toString() === curr.sort().toString();
    return acc + (isCorrect ? 1 : 0);
  }, 0);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Feedback</h1>
      <p className="text-lg">Score: {score} / {questions.length}</p>
      {questions.map((q: any, i: number) => {
        const correct = q.correctAnswer.sort().toString() === answers[i].sort().toString();
        return (
          <div key={q.questionId} className="p-3 border rounded bg-gray-50">
            <p className="font-semibold">Q{i + 1}: {q.question}</p>
            <p>Your Answer: {answers[i].join(', ')}</p>
            {!correct && <p className="text-red-600">Correct: {q.correctAnswer.join(', ')}</p>}
          </div>
        );
      })}
    </div>
  );
};

export default FeedbackScreen;
