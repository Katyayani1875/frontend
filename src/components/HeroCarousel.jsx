import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  const slides = [
    {
      image: "/images/professional-collaboration.jpg",
      heading: "Collaborate with Top Professionals",
      subheading: "Join a network of skilled individuals.",
    },
    {
      image: "/images/remote-work-setup.jpg",
      heading: "Work from Anywhere",
      subheading: "Embrace the flexibility of remote jobs.",
    },
    {
      image: "/images/ai-technology.jpg",
      heading: "Powered by AI",
      subheading: "Experience intelligent job matching.",
    },
    {
      image: "/images/job-search-concept.png",
      heading: "Find Your Dream Job",
      subheading: "Search and apply with ease.",
    },
    {
      image: "/images/success-celebration.jpg",
      heading: "Celebrate Your Success",
      subheading: "Achieve your career goals with us.",
    },
  ];

  return (
    <div className="relative w-full flex justify-center pb-12 px-4">
      <div className="w-full max-w-[700px]">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className="relative">
              <img
                src={slide.image}
                alt={slide.heading}
                className="w-full h-[200px] md:h-[300px] object-cover rounded-xl"
              />
              <div className="absolute bottom-3 left-3 bg-black/60 text-white p-3 rounded-lg max-w-sm">
                <h2 className="text-lg md:text-xl font-semibold">{slide.heading}</h2>
                <p className="text-sm md:text-base">{slide.subheading}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default HeroCarousel;

// ▶  Arrows

function CustomNextArrow({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full p-2 shadow-md cursor-pointer z-10 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <svg className="h-5 w-5 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

function CustomPrevArrow({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full p-2 shadow-md cursor-pointer z-10 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <svg className="h-5 w-5 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </div>
  );
}
