import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { index as fetchServicesAPI } from "../../utilities/services-api";
import "./ServicesPage.css";

export default function ServicesPage({ user }) {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        setError(null);
        const data = await fetchServicesAPI();
        if (data && Array.isArray(data)) {
          setServices(data);
        } else {
          setServices([]);
        }
      } catch (error) {
        setError(error.message || 'Failed to load services. Please try again later.');
        setServices([]);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="services-grid">
        <div className="page-status">Loading services...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="services-grid">
        <div className="page-status error">{error}</div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="services-grid">
        <div className="page-status">No services available at the moment.</div>
      </section>
    );
  }

  function handleBookAppointment() {
    if (user) {
      navigate("/appointments?new=true");
    } else {
      navigate("/signup");
    }
  }

  return (
    <section className="services-grid">
      {services.map((service) => (
        <div key={service.id} className="service-card">
          <div className="service-card-image">
            <img src={service.imageURL || service.image} alt={service.service_name} />
          </div>
          <div className="service-card-body">
            <h3>{service.service_name}</h3>
            <p>{service.description}</p>
            <div className="service-card-actions">
              <button
                onClick={handleBookAppointment}
                className="service-book-link"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}


