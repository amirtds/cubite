import React, { useState } from 'react';

interface Option {
  text: string;
  isCorrect: boolean;
}

interface MultipleChoiceData {
  weight: string;
  options: Option[];
  questionText: string;
}

interface Props {
  data: MultipleChoiceData;
}

const EditorMultipleChoice: React.FC<Props> = ({ data }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  return (
    <div className="my-8 p-8 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{data.questionText}</h3>
      <ul className="space-y-4">
        {data.options.map((option, index) => (
          <li key={index}>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="multipleChoice"
                checked={selectedOption === index}
                onChange={() => handleOptionSelect(index)}
                className="radio radio-primary"
              />
              <span className={`${showResult && option.isCorrect ? 'text-green-500 font-medium' : ''}`}>
                {option.text}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <button 
          onClick={handleSubmit} 
          className="btn btn-primary"
          disabled={selectedOption === null || showResult}
        >
          Submit
        </button>
      </div>
      {showResult && (
        <div className="mt-4">
          {data.options[selectedOption!].isCorrect ? (
            <p className="text-green-500">Correct!</p>
          ) : (
            <p className="text-error">Incorrect. Try again!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EditorMultipleChoice;