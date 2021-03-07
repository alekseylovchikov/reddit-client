import classNames from 'classnames';

interface InputGroupProps {
  className?: string
  type: string
  placeholder: string
  value: string
  error: string | undefined
  setValue: (str: string) => void
}

const InputGroup: React.FC<InputGroupProps> = ({
  error,
  className,
  type,
  placeholder,
  value,
  setValue
}) => {
  return (
    <div className={className}>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        type={type}
        placeholder={placeholder}
        className={classNames('w-full p-3 transition duration-200 border border-gray-300 rounded outline-none focus:bg-white hover:bg-white bg-gray-50', { 'border-red-500': error })}
      />
      <small className="font-medium text-red-600">{error}</small>
    </div>
  );
};

export default InputGroup;