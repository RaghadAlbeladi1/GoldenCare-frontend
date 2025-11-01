import { useEffect, useState } from "react";
import { index as fetchCaregiversAPI } from "../../utilities/caregivers-api";
import "./CaregiversPage.css";

export default function CaregiversPage() {
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCaregivers() {
      try {
        setError(null);
        const data = await fetchCaregiversAPI();
        if (data && Array.isArray(data)) {
          setCaregivers(data);
        } else {
          setCaregivers([]);
        }
      } catch (error) {
        setError(error.message || 'Failed to load caregivers. Please try again later.');
        setCaregivers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCaregivers();
  }, []);

  if (loading) {
    return (
      <section className="caregivers-list">
        <div className="page-status">Loading caregivers...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="caregivers-list">
        <div className="page-status error">{error}</div>
      </section>
    );
  }

  if (caregivers.length === 0) {
    return (
      <section className="caregivers-list">
        <div className="page-status">No caregivers available at the moment.</div>
      </section>
    );
  }

  return (
    <section className="caregivers-list">
      {caregivers.map((caregiver) => (
        <div key={caregiver.id} className="caregiver-card">
          <img src={caregiver.imageURL || caregiver.image} alt={caregiver.name} className="caregiver-card-image" />
          <div className="caregiver-card-body">
            <h3>{caregiver.name}</h3>
            <p>{caregiver.speciality}</p>
            {caregiver.bio && <p>{caregiver.bio}</p>}
            {Array.isArray(caregiver.services) && caregiver.services.length > 0 && (
              <div className="caregiver-card-services">
                <span>Services:</span>
                <ul>
                  {caregiver.services.map((service) => (
                    <li key={service.id}>{service.service_name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}


