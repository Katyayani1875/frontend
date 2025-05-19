const companies = [
  { name: "Google", logo: "/logos/google.png" },
  { name: "Tata", logo: "/logos/Tata.png" },
  { name: "Microsoft", logo: "/logos/microsoft.svg" },
  { name: "Amazon", logo: "/logos/amazon.jpg" },
    { name: "wipro", logo: "/logos/wipro.png" },
     { name: "flipkart", logo: "/logos/flipkart.png" },
  { name: "loreal", logo: "/logos/loreal.png" },
  { name: "Myntra", logo: "/logos/myntra.png" },
];

const TopCompanies = () => {
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Top Hiring Companies
      </h2>
      <div className="flex items-center justify-center gap-10 flex-wrap">
        {companies.map((company, index) => (
          <img
            key={index}
            src={company.logo}
            alt={company.name}
            className="w-16 h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300 ease-in-out transform hover:scale-105"
            draggable={false}
          />
        ))}
      </div>
    </section>
  );
};

export default TopCompanies;
