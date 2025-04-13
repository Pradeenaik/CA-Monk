import React, { useState, useEffect } from "react";
import { fetchQuestions } from "../utils/fetchQuestions";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";
import { QuizData } from "../utils/types";

const Home: React.FC = () => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timePerQuestion] = useState(30);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetchQuestions();
        setQuizData(response);
      } catch (err) {
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  useEffect(() => {
    if (quizData) {
      setIsLastQuestion(currentQuestionIndex === quizData.data.questions.length - 1);
    }
  }, [currentQuestionIndex, quizData]);

  const handleWordSelect = (word: string) => {
    const currentQuestion = quizData?.data.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
      return;
    }

    if (selectedWords.length >= currentQuestion.correctAnswer.length) return;

    setSelectedWords([...selectedWords, word]);
  };

  const calculateScore = (): number => {
    if (!quizData) return 0;

    const currentQuestion = quizData.data.questions[currentQuestionIndex];
    return selectedWords.reduce((acc, word, index) => {
      return acc + (word === currentQuestion.correctAnswer[index] ? 1 : 0);
    }, 0);
  };

  const handleNext = () => {
    if (!quizData) return;

    setScore(score + calculateScore());

    if (isLastQuestion) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedWords([]);
    }
  };

  const handleTimeout = () => {
    handleNext();
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedWords([]);
    setQuizCompleted(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-lg font-medium text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md w-full">
          <p className="text-red-500 text-lg font-semibold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4 text-green-600">Quiz Completed!</h1>
          <p className="text-xl mb-6 text-gray-700">
            Your final score:{" "}
            <span className="font-bold text-blue-600">{score}</span> out of{" "}
            <span className="font-bold text-blue-600">
              {quizData?.data.questions.reduce((sum, q) => sum + q.correctAnswer.length, 0)}
            </span>
          </p>
          <button
            onClick={restartQuiz}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col items-center justify-center px-4 py-6">
      {quizData && (
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6">
            <Timer
              duration={timePerQuestion}
              onTimeout={handleTimeout}
              key={currentQuestionIndex}
            />

            {quizData.data.questions[currentQuestionIndex] && (
              <QuestionCard
                question={quizData.data.questions[currentQuestionIndex]}
                onNext={handleNext}
                selectedWords={selectedWords}
                onWordSelect={handleWordSelect}
                isLastQuestion={isLastQuestion}
              />
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
              <p className="font-semibold text-gray-700">
                Question {currentQuestionIndex + 1} of {quizData.data.questions.length}
              </p>
              <div className="flex items-center gap-4">
                <p className="font-bold text-lg text-blue-700">
                  Score: {score}
                </p>
                <p className="text-sm text-gray-500">
                  &nbsp;Current: +{calculateScore()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
