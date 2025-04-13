import React from 'react';
import { Question } from '../utils/types';

interface QuestionCardProps {
  question: Question;
  onNext: () => void;
  selectedWords: string[];
  onWordSelect: (word: string) => void;
  isLastQuestion: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  onNext, 
  selectedWords, 
  onWordSelect,
  isLastQuestion
}) => {
  // Split the question text into parts based on the blanks
  const questionParts = question.question.split('_____________');
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-medium text-gray-800">
          Fill in the blanks with the correct words in order:
        </h2>
        
        <div className="mt-4">
          {questionParts.map((part, index) => (
            <React.Fragment key={index}>
              <span>{part}</span>
              {index < questionParts.length - 1 && (
                <span className="mx-1 font-bold text-blue-600">
                  {selectedWords[index] ? `[${selectedWords[index]}]` : '________'}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {question.options.map((word) => (
          <button
            key={word}
            onClick={() => onWordSelect(word)}
            disabled={selectedWords.includes(word)}
            className={`p-3 rounded-lg border transition-all ${
              selectedWords.includes(word)
                ? 'bg-blue-500 text-white border-blue-600'
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
            }`}
          >
            {word}
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={selectedWords.length !== question.correctAnswer.length}
        className={`w-full py-3 rounded-lg text-white font-medium ${
          selectedWords.length === question.correctAnswer.length
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
      </button>
    </div>
  );
};

export default QuestionCard;