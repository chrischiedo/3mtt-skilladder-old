const Loader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      <span className="ml-2">Saving...</span>
    </div>
  );
};

export default Loader; 