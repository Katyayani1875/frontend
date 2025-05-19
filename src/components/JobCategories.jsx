import {
    LaptopIcon,
    BanknoteIcon,
    PaintbrushIcon,
    MegaphoneIcon,
  } from "lucide-react";
  
  const categories = [
    { icon: <LaptopIcon className="w-6 h-6" />, label: "IT" },
    { icon: <BanknoteIcon className="w-6 h-6" />, label: "Finance" },
    { icon: <PaintbrushIcon className="w-6 h-6" />, label: "Design" },
    { icon: <MegaphoneIcon className="w-6 h-6" />, label: "Marketing" },
  ];
  
  const JobCategories = () => {
    return (
      <section className="py-12 bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-center mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-5 border rounded-xl dark:border-gray-700 hover:shadow-lg transition duration-200"
            >
              <div className="text-blue-600 mb-2">{cat.icon}</div>
              <span className="font-medium text-center">{cat.label}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default JobCategories;
  