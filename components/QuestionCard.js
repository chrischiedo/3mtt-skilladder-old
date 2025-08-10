export default function QuestionCard({ question, selectedValue, onAnswerChange }) {
  const options = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

  return (
    <div className="mb-8 p-6 bg-white shadow-md rounded-md border border-gray-200">
      <p className="text-lg font-semibold text-gray-700 mb-4">{question}</p>
      <div className="space-y-2">
        {options.map((option, index) => (
          <label
            key={index}
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
          >
            <input
              type="radio"
              name={question}
              value={option}
              checked={selectedValue === option} // Check if the option matches the saved response
              className="form-radio text-blue-600 focus:ring focus:ring-blue-300 focus:outline-none"
              onChange={(e) => onAnswerChange(e.target.value)}
            />
            <span className="text-gray-600">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
