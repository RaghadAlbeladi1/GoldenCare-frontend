import { useState, useEffect } from "react";
import "./HomePage.css";
import HomePage1 from "../../assets/images/HomePage1.jpg";
import HomePage2 from "../../assets/images/HomePage2.jpg";
import HomePage3 from "../../assets/images/HomePage3.jpg";
import HomePage4 from "../../assets/images/HomePage4.jpg";

export default function HomePage() {
  const images = [
    HomePage1, 
    HomePage2,
    HomePage3,
    HomePage4
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); 

    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="home-hero">
      <div className="image-slider">
        {images.map((img, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? "active" : ""}`}
          >
            <img src={img} alt={`Hero ${index + 1}`} className="home-hero-image" />
          </div>
        ))}
        
        {images.length > 1 && (
          <>
            <button className="slider-btn prev-btn" onClick={goToPrevious}>
              &#8249;
            </button>
            <button className="slider-btn next-btn" onClick={goToNext}>
              &#8250;
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="slider-dots">
            {images.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              ></span>
            ))}
          </div>
        )}
      </div>
      
      <div className="home-hero-content">
        <h1>Healthcare services for a connected healthcare system</h1>
        <p>
          At GoldenCare, we make connected care possible so that better outcomes
          and experiences are easier to achieve.
        </p>
      </div>
    </section>
  );
}


