import { useEffect, useState } from "react";
import * as appointmentsAPI from "../../utilities/appointments-api";
import * as servicesAPI from "../../utilities/services-api";
import * as caregiversAPI from "../../utilities/caregivers-api";
import "./AppointmentsPage.css";

export default function AppointmentsPage({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    service: "",
    caregiver: "",
    date: "",
    time: "",
    duration_type: "1day",
    start_date: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (user) {
      fetchAppointments();
      fetchServicesAndCaregivers();
    } else {
      setLoading(false);
      setError("Please login to view your appointments.");
    }
  }, [user]);

  async function fetchAppointments() {
    try {
      setError(null);
      const data = await appointmentsAPI.index();
      if (data && Array.isArray(data)) {
        setAppointments(data);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      let errorMessage = "Failed to load appointments.";
      if (error.error) {
        errorMessage = error.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchServicesAndCaregivers() {
    try {
      const [servicesData, caregiversData] = await Promise.all([
        servicesAPI.index(),
        caregiversAPI.index(),
      ]);
      setServices(servicesData);
      setCaregivers(caregiversData);
    } catch (error) {
    }
  }

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    if (formErrors[evt.target.name]) {
      setFormErrors({ ...formErrors, [evt.target.name]: "" });
    }
  }

  function handleNewAppointment() {
    setFormData({
      service: "",
      caregiver: "",
      date: "",
      time: "",
      duration_type: "1day",
      start_date: "",
      notes: "",
    });
    setEditingId(null);
    setFormErrors({});
    setShowForm(true);
  }

  async function handleEdit(appointmentId) {
    try {
      const appointmentData = await appointmentsAPI.detail(appointmentId);
      if (appointmentData) {
        setFormData({
          service: appointmentData.service?.id || "",
          caregiver: appointmentData.caregiver?.id || "",
          date: appointmentData.date || "",
          time: appointmentData.time || "",
          duration_type: appointmentData.duration_type || "1day",
          start_date: appointmentData.start_date || appointmentData.date || "",
          notes: appointmentData.notes || "",
        });
        setEditingId(appointmentId);
        setFormErrors({});
        setShowForm(true);
      }
    } catch (error) {
      alert("Failed to load appointment data.");
    }
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      service: "",
      caregiver: "",
      date: "",
      time: "",
      duration_type: "1day",
      start_date: "",
      notes: "",
    });
    setFormErrors({});
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    
    const newErrors = {};
    if (!formData.service) newErrors.service = "Please select a service";
    if (!formData.caregiver) newErrors.caregiver = "Please select a caregiver";
    if (!formData.start_date) newErrors.start_date = "Please select a start date";
    if (!formData.time) newErrors.time = "Please select a time";
    if (!formData.duration_type) newErrors.duration_type = "Please select duration";
    
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    try {
      const appointmentData = {
        ...formData,
        start_date: formData.start_date || formData.date,
        date: formData.start_date || formData.date,
      };
      
      if (editingId) {
        await appointmentsAPI.update(appointmentData, editingId);
        alert("Appointment updated successfully");
      } else {
        await appointmentsAPI.create(appointmentData);
      }
      
      handleCancelForm();
      fetchAppointments();
    } catch (error) {
      alert(editingId ? "Failed to update appointment. Please try again." : "Failed to create appointment. Please try again.");
    }
  }

  async function handleDelete(appointmentId) {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await appointmentsAPI.deleteAppointment(appointmentId);
        alert("Appointment cancelled successfully");
        setAppointments(appointments.filter(apt => apt.id !== appointmentId));
      } catch (error) {
        alert("Failed to cancel appointment. Please try again.");
      }
    }
  }

  const filteredCaregivers = formData.service
    ? caregivers.filter(caregiver =>
        caregiver.services.some(s => s.id === parseInt(formData.service))
      )
    : [];

  if (loading) {
    return (
      <div className="page-header">
        <h1>My Appointments</h1>
        <div className="page-status">Loading appointments...</div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>My Appointments</h1>
      </div>
      <div className="appointments-container">
        {error ? (
          <div className="page-status error">{error}</div>
        ) : showForm ? (
          <div className="appointments-form-section">
            <div className="form-header">
              <h2>{editingId ? "Edit Appointment" : "Book New Appointment"}</h2>
              <button onClick={handleCancelForm} className="simple-link-btn">Cancel</button>
            </div>
            <form onSubmit={handleSubmit} className="appointment-form">
              <div className="form-group">
                <label htmlFor="id_service">Service *</label>
                <select
                  id="id_service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="">Select a service</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.service_name}
                    </option>
                  ))}
                </select>
                {formErrors.service && <p className="error-text">{formErrors.service}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="id_caregiver">Caregiver *</label>
                <select
                  id="id_caregiver"
                  name="caregiver"
                  value={formData.caregiver}
                  onChange={handleChange}
                  required
                  disabled={!formData.service}
                  className="form-input"
                >
                  <option value="">
                    {formData.service ? "Select a caregiver" : "First select a service"}
                  </option>
                  {filteredCaregivers.map(caregiver => (
                    <option key={caregiver.id} value={caregiver.id}>
                      {caregiver.name} - {caregiver.speciality}
                    </option>
                  ))}
                </select>
                {formErrors.caregiver && <p className="error-text">{formErrors.caregiver}</p>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="id_start_date">Date *</label>
                  <input
                    type="date"
                    id="id_start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="form-input"
                  />
                  {formErrors.start_date && <p className="error-text">{formErrors.start_date}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="id_time">Time *</label>
                  <input
                    type="time"
                    id="id_time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                  {formErrors.time && <p className="error-text">{formErrors.time}</p>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="id_duration_type">Duration *</label>
                <select
                  id="id_duration_type"
                  name="duration_type"
                  value={formData.duration_type}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="1day">1 Day</option>
                  <option value="1month">1 Month</option>
                  <option value="3months">3 Months</option>
                </select>
                {formErrors.duration_type && <p className="error-text">{formErrors.duration_type}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="id_notes">Notes (Optional)</label>
                <textarea
                  id="id_notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  className="form-input"
                  placeholder="Add any additional notes..."
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCancelForm} className="simple-link-btn">
                  Cancel
                </button>
                <button type="submit" className="btn submit">
                  {editingId ? "Update Appointment" : "Book Appointment"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="appointments-header">
              <button onClick={handleNewAppointment} className="btn submit">
                Book New Appointment
              </button>
            </div>
            {appointments.length === 0 ? (
              <div className="page-status">
                <p>No appointments yet.</p>
              </div>
            ) : (
              <div className="appointments-list">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="appointment-card">
                    <div className="appointment-header">
                      <h3>{appointment.service.service_name}</h3>
                      <span className="status-badge status-confirmed">
                        ✓
                      </span>
                    </div>
                    <div className="appointment-details">
                      <p><strong>Caregiver:</strong> {appointment.caregiver.name}</p>
                      <p><strong>Speciality:</strong> {appointment.caregiver.speciality}</p>
                      <p><strong>Start Date:</strong> {appointment.start_date ? new Date(appointment.start_date).toLocaleDateString() : new Date(appointment.date).toLocaleDateString()}</p>
                      {appointment.end_date && (
                        <p><strong>End Date:</strong> {new Date(appointment.end_date).toLocaleDateString()}</p>
                      )}
                      <p><strong>Time:</strong> {appointment.time}</p>
                      {appointment.duration_type && (
                        <p><strong>Duration:</strong> {
                          appointment.duration_type === '1day' ? '1 Day' :
                          appointment.duration_type === '1month' ? '1 Month' :
                          appointment.duration_type === '3months' ? '3 Months' : appointment.duration_type
                        }</p>
                      )}
                      {appointment.notes && (
                        <p><strong>Notes:</strong> {appointment.notes}</p>
                      )}
                    </div>
                    <div className="appointment-actions">
                      <button
                        onClick={() => handleEdit(appointment.id)}
                        className="simple-link-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="simple-link-btn danger"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
