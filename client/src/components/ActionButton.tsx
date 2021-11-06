const ActionButton = ({ children }) => {
  return (
    <div className="text-gray-400 px-1 py-1 mr-1 rounded cursor-pointer hover:bg-gray-200 text-xs">
      {children}
    </div>
  );
};

export default ActionButton;
