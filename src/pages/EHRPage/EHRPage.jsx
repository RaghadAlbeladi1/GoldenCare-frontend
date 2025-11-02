import { useEffect, useState } from "react";
import * as ehrAPI from "../../utilities/ehr-api";
import * as appointmentsAPI from "../../utilities/appointments-api";
import "./EHRPage.css";

export default function EHRPage({ user }) {
  const [ehr, setEhr] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setError(null);
        const [ehrData, appointmentsData] = await Promise.all([
          ehrAPI.getEHR().catch(() => null),
          appointmentsAPI.index().catch(() => []),
        ]);
        console.log("Fetched EHR Data:", ehrData);
        if (ehrData) {
          setEhr(ehrData);
          if (ehrData.appointments && Array.isArray(ehrData.appointments)) {
            setAppointments(ehrData.appointments);
          }
        }
        
        if (appointmentsData && Array.isArray(appointmentsData)) {
          setAppointments(appointmentsData);
        }
      } catch (error) {
        setError(error.message || "Failed to load EHR data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  function formatTimeTo12Hour(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }

  if (loading) {
    return (
      <div className="page-header">
        <h1>Electronic Health Record (EHR)</h1>
        <div className="page-status">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-header">
        <h1>Electronic Health Record (EHR)</h1>
        <div className="page-status error">{error}</div>
      </div>
    );
  }

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(a.start_date || a.date);
    const dateB = new Date(b.start_date || b.date);
    return dateB - dateA;
  });

  return (
    <div className="ehr-page">
      <div className="page-header">
        <h1>Electronic Health Record (EHR)</h1>
      </div>
      <section className="ehr-section patient-info">
        <h2>Patient Information</h2>
        {ehr ? (
          <div className="patient-details">
            {ehr.image && (
              <div className="patient-image">
                <img src={ehr.image} alt={ehr.name || user?.username} />
              </div>
            )}
            <div className="patient-info-grid">
              <p><strong>Patient ID:</strong> {ehr.patient_id}</p>
              <p><strong>Name:</strong> {ehr.name || user?.username}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {ehr.phone || "Not provided"}</p>
              <p><strong>Age:</strong> {ehr.age || "Not provided"}</p>
              <p><strong>Gender:</strong> {ehr.gender || "Not provided"}</p>
              <p><strong>Location:</strong> {ehr.location || "Not provided"}</p>
            </div>
          </div>
        ) : (
          <div className="patient-details">
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </div>
        )}
      </section>
      <section className="ehr-section medical-history">
        <h2>Patient History</h2>
        {sortedAppointments.length === 0 ? (
          <p className="no-data">No appointments yet.</p>
        ) : (
          <div className="appointments-timeline">
            {sortedAppointments.map((appointment) => {
              const isCompleted = appointment.status === 'completed' || appointment.status === 'confirmed';
              return (
              <div key={appointment.id} className={`history-item-row ${isCompleted ? 'completed-service' : ''}`}>
                <h3 className="history-service-name">{appointment.service?.service_name || "Service"}</h3>
                <p className="history-detail-item">
                  <strong>Start Date:</strong>{" "}
                  {appointment.start_date
                    ? new Date(appointment.start_date).toLocaleDateString()
                    : new Date(appointment.date).toLocaleDateString()}
                </p>
                {appointment.end_date && (
                  <p className="history-detail-item">
                    <strong>End Date:</strong>{" "}
                    {new Date(appointment.end_date).toLocaleDateString()}
                  </p>
                )}
                <p className="history-detail-item"><strong>Time:</strong> {formatTimeTo12Hour(appointment.time)}</p>
                <p className="history-detail-item"><strong>Caregiver:</strong> {appointment.caregiver?.name}</p>
                <p className="history-detail-item"><strong>Speciality:</strong> {appointment.caregiver?.speciality}</p>
                {appointment.status === 'completed' && (
                  <span className="status-badge status-completed">
                    Done
                  </span>
                )}
              </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
