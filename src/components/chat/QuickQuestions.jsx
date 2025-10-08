function QuickQuestions({ categories, selectedCategory, onCategoryClick, showMore = true }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 p-4">
      <div className="flex items-center mb-3">
        <span className="text-lg mr-2">❓</span>
        <h3 className="text-lg font-semibold text-gray-800">빠른 질문</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category)}
            className={`bg-gradient-to-b from-white to-gray-100 border-2 text-black font-bold px-4 py-2 rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 focus:outline-none transform hover:-translate-y-1 active:translate-y-0 ${
              selectedCategory === category.name 
                ? 'border-blue-400 bg-gradient-to-b from-blue-50 to-blue-100 shadow-xl focus:border-blue-400' 
                : 'border-blue-400 hover:bg-gradient-to-b hover:from-blue-50 hover:to-blue-100 focus:border-blue-400'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
        {showMore && (
          <button className="bg-gradient-to-b from-white to-gray-100 border-2 border-blue-400 text-gray-600 font-bold px-4 py-2 rounded-xl text-sm shadow-lg hover:bg-gradient-to-b hover:from-blue-50 hover:to-blue-100 hover:shadow-xl transition-all duration-200 focus:outline-none focus:border-blue-400 transform hover:-translate-y-1 active:translate-y-0">
            더보기
          </button>
        )}
      </div>
    </div>
  );
}

export default QuickQuestions;

