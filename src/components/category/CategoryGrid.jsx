import { useNavigate } from 'react-router-dom';

function CategoryGrid({ categories, selectedCategory }) {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    console.log('CategoryGrid - 클릭된 카테고리:', category);
    console.log('CategoryGrid - 카테고리 이름:', category.name);
    console.log('CategoryGrid - 카테고리 ID:', category.id);
    console.log('CategoryGrid - 이동할 URL:', `/chat/${category.name}`);
    
    // 카테고리 이름을 URL 파라미터로 사용하여 ChatPage로 이동
    navigate(`/chat/${category.name}`);
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category)}
          className={`bg-gradient-to-b from-white to-gray-100 border-2 rounded-xl p-4 shadow-xl hover:shadow-2xl transition-all duration-200 text-center group h-16 flex flex-col justify-center items-center focus:outline-none transform hover:-translate-y-1 active:translate-y-0 ${
            selectedCategory === category.name 
              ? 'border-blue-400 bg-gradient-to-b from-blue-50 to-blue-100 shadow-2xl focus:border-blue-400' 
              : 'border-blue-400 hover:bg-gradient-to-b hover:from-blue-50 hover:to-blue-100 focus:border-blue-400'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-2xl group-hover:scale-110 transition-transform">{category.icon}</span>
            <div className="font-bold text-black group-hover:text-gray-800 transition-colors text-base leading-tight">
              {category.name}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default CategoryGrid;

