import React from 'react';
import classNames from "classnames";

interface InputGroupProps {
    className?: string,
    type: string,
    name: string,
    placeholder: string,
    error: string
}

const InputGroup: React.FC<InputGroupProps> = (props: InputGroupProps) => {
    const {className, type, name, placeholder, error} = props;

    const inputClassName = classNames('transition duration-300 w-full p-3 outline-none bg-gray-50 border border-gray-300 rounded focus:bg-white hover:bg-white', {
        'border-red-500': error,
    });
    return (
        <div className={className}>
            <input type={type}
                   className={inputClassName}
                   placeholder={placeholder}
                   name={name}
            />
            {error && (
                <small className="font-medium text-red-600">
                    {error}
                </small>
            )}
        </div>
    );
};

export default InputGroup;
