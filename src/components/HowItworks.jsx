import React from "react";

const steps = [
    { step: "1", title: "Sign Up" },
    { step: "2", title: "Upload Resume" },
    { step: "3", title: "Apply to Jobs" },
    { step: "4", title: "Get Hired" },
  ];
  
  const HowItWorks = () => {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center mb-6">How It Works?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((s, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-6 border dark:border-gray-700 rounded-xl text-center shadow"
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">{s.step}</div>
              <p className="font-medium">{s.title}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default HowItWorks;