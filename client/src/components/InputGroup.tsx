import classNames from "classnames";

interface InputGroupProps {
  className?: string;
  type: string;
  placeholder: string;
  value: string;
  error: string | undefined;
  setValue: (str: string) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({
  error,
  placeholder: placehoolder,
  setValue,
  type,
  value,
  className,
}) => {
  return (
    <div className={className}>
      <input
        type={type}
        className={classNames(
          "transition duration-200 w-full p-3 outline-none rounded bordrer-gray-300 border du bg-gray-50 focus:bg-white hover:bg-white",
          { "border-red-500": error }
        )}
        placeholder={placehoolder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <small className="font-medium text-red-600">{error}</small>
    </div>
  );
};

export default InputGroup;
