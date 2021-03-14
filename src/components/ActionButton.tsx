export default function ActionButton({ children }) {
  return (
    <div className="px-1 py-1 mr-1 text-gray-400 rounded cursor-pointer hover:bg-gray-200">
      {children}
    </div>
  );
}
