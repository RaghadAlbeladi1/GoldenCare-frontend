import { useState, useEffect } from "react";
import "./HomePage.css";
import HomePage1 from "../../assets/images/HomePage1.jpg";
import HomePage2 from "../../assets/images/HomePage2.jpg";
import HomePage3 from "../../assets/images/HomePage3.jpg";
import HomePage4 from "../../assets/images/HomePage4.jpg";
import * as reviewsAPI from "../../utilities/reviews-api";
import * as servicesAPI from "../../utilities/services-api";

export default function HomePage({ user }) {
  const images = [
    HomePage1, 
    HomePage2,
    HomePage3,
    HomePage4
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewFormData, setReviewFormData] = useState({
    service_id: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); 

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await reviewsAPI.index();
        if (data && Array.isArray(data)) {
          setReviews(data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [user]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await servicesAPI.index();
        setServices(data);
      } catch (error) {
      }
    }
    if (user && showReviewForm) {
      fetchServices();
    }
  }, [user, showReviewForm]);

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

  function renderStars(rating) {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? "star filled" : "star empty"}>
          ★
        </span>
      );
    }
    return stars;
  }

  function handleReviewChange(evt) {
    setReviewFormData({ ...reviewFormData, [evt.target.name]: evt.target.value });
  }

  function handleNewReview() {
    setReviewFormData({
      service_id: "",
      rating: 5,
      comment: "",
    });
    setEditingReviewId(null);
    setShowReviewForm(true);
  }

  async function handleEditReview(reviewId) {
    try {
      const reviewData = await reviewsAPI.detail(reviewId);
      if (reviewData) {
        setReviewFormData({
          service_id: reviewData.service?.id || "",
          rating: reviewData.rating || 5,
          comment: reviewData.comment || "",
        });
        setEditingReviewId(reviewId);
        setShowReviewForm(true);
      }
    } catch (error) {
      alert("Failed to load review.");
    }
  }

  function handleCancelReviewForm() {
    setShowReviewForm(false);
    setEditingReviewId(null);
    setReviewFormData({
      service_id: "",
      rating: 5,
      comment: "",
    });
  }

  async function handleSubmitReview(evt) {
    evt.preventDefault();
    
    if (!reviewFormData.service_id || !reviewFormData.comment) {
      alert("Please fill all fields.");
      return;
    }

    try {
      if (editingReviewId) {
        await reviewsAPI.update(reviewFormData, editingReviewId);
        alert("Review updated successfully");
      } else {
        await reviewsAPI.create(reviewFormData);
        alert("Review created successfully");
      }
      
      handleCancelReviewForm();
      const data = await reviewsAPI.index();
      if (data && Array.isArray(data)) {
        setReviews(data);
      }
    } catch (error) {
      alert(editingReviewId ? "Failed to update review." : "Failed to create review.");
    }
  }

  async function handleDeleteReview(reviewId) {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await reviewsAPI.deleteReview(reviewId);
        alert("Review deleted successfully");
        const data = await reviewsAPI.index();
        if (data && Array.isArray(data)) {
          setReviews(data);
        }
      } catch (error) {
        alert("Failed to delete review.");
      }
    }
  }

  return (
    <>
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
      </section>

      {!loading && (
        <section className="reviews-section">
          <div className="reviews-header">
            <h2 className="reviews-title">Reviews</h2>
            {user && (
              <a href="#" onClick={(e) => { e.preventDefault(); handleNewReview(); }} className="simple-link-btn">
                Add Review
              </a>
            )}
          </div>

          {user && showReviewForm && (
            <div className="review-form-container">
              <form onSubmit={handleSubmitReview} className="review-form">
                <div className="review-form-group">
                  <label htmlFor="review_service">Service *</label>
                  <select
                    id="review_service"
                    name="service_id"
                    value={reviewFormData.service_id}
                    onChange={handleReviewChange}
                    required
                    className="review-form-input"
                  >
                    <option value="">Select a service</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.service_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="review-form-group">
                  <label htmlFor="review_rating">Rating *</label>
                  <select
                    id="review_rating"
                    name="rating"
                    value={reviewFormData.rating}
                    onChange={handleReviewChange}
                    required
                    className="review-form-input"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                <div className="review-form-group">
                  <label htmlFor="review_comment">Comment *</label>
                  <textarea
                    id="review_comment"
                    name="comment"
                    value={reviewFormData.comment}
                    onChange={handleReviewChange}
                    rows="4"
                    className="review-form-input"
                    required
                  />
                </div>

                <div className="review-form-actions">
                  <a href="#" onClick={(e) => { e.preventDefault(); handleCancelReviewForm(); }} className="simple-link-btn">
                    Cancel
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleSubmitReview(e); }} className="simple-link-btn">
                    {editingReviewId ? "Update" : "Submit"}
                  </a>
                </div>
              </form>
            </div>
          )}

          {reviews.length > 0 && (
            <div className="reviews-container">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-stars">{renderStars(review.rating)}</div>
                  <p className="review-comment">{review.comment}</p>
                  <p className="review-author">@family for {review.user?.username || "User"}</p>
                  {user && review.user?.id === user.id && (
                    <div className="review-actions">
                      <a href="#" onClick={(e) => { e.preventDefault(); handleEditReview(review.id); }} className="simple-link-btn">
                        Edit
                      </a>
                      <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteReview(review.id); }} className="simple-link-btn danger">
                        Delete
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}


