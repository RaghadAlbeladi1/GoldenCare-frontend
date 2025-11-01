import { useEffect, useState } from "react";
import { index as fetchServicesAPI } from "../../utilities/services-api";
import "./ServicesPage.css";


export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await fetchServicesAPI();
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching services:', err);
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

  if (services.length === 0) {
    return (
      <section className="services-grid">
        <div className="page-status">No services available at the moment.</div>
      </section>
    );
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
              <button className="btn-primary">Appointment</button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}


