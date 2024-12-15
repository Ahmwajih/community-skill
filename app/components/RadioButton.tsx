    import React from 'react';
    
    interface RadioButtonProps {
      options: string[];
      selectedOption: string;
      onChange: (option: string) => void;
    }
    
    const RadioButton: React.FC<RadioButtonProps> = ({ options, selectedOption, onChange }) => {
      return (
        <div className="flex flex-col space-y-2">
          {options.map((option) => (
            <label key={option} className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                name="radio"
                value={option}
                checked={selectedOption === option}
                onChange={() => onChange(option)}
              />
              <span className="ml-2 text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      );
    };
    
    export default RadioButton;