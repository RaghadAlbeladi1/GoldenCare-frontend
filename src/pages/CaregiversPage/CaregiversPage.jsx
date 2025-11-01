import { useEffect, useState } from "react";
import { index as fetchCaregiversAPI } from "../../utilities/caregivers-api";
import "./CaregiversPage.css";

export default function CaregiversPage() {
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCaregivers() {
      try {
        const data = await fetchCaregiversAPI();
        setCaregivers(data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    fetchCaregivers();
  }, []);

  if (loading) return null;

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


