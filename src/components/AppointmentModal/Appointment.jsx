import { useState, useEffect } from "react";
import * as appointmentsAPI from "../../utilities/appointments-api";
import * as caregiversAPI from "../../utilities/caregivers-api";
import "./AppointmentModal.css";

export default function AppointmentModal({ isOpen, onClose, user, onSuccess }) {
  const [caregivers, setCaregivers] = useState([]);
  const [formData, setFormData] = useState({
    caregiver: "",
    start_date: "",
    time: "",
    duration_type: "1day",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      async function fetchCaregivers() {
        try {
          const caregiversData = await caregiversAPI.index();
          setCaregivers(caregiversData);
        } catch (error) {
        }
      }
      fetchCaregivers();
    }
  }, [isOpen]);

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    
    if (errors[evt.target.name]) {
      setErrors({ ...errors, [evt.target.name]: "" });
    }
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    
    const newErrors = {};
    if (!formData.caregiver) newErrors.caregiver = "Please select a caregiver";
    if (!formData.start_date) newErrors.start_date = "Please select a date";
    if (!formData.time) newErrors.time = "Please select a time";
    if (!formData.duration_type) newErrors.duration_type = "Please select duration";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const caregiverObj = caregivers.find(c => c.id === parseInt(formData.caregiver));
      if (!caregiverObj || !caregiverObj.services || caregiverObj.services.length === 0) {
        alert("Please select a valid caregiver with available services.");
        return;
      }

      const appointmentData = {
        service: parseInt(caregiverObj.services[0].id),
        caregiver: parseInt(formData.caregiver),
        start_date: formData.start_date,
        date: formData.start_date,
        time: formData.time,
        duration_type: formData.duration_type,
        notes: formData.notes || "",
      };
      
      await appointmentsAPI.create(appointmentData);
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess();
        onClose();
        setFormData({
          caregiver: "",
          start_date: "",
          time: "",
          duration_type: "1day",
          notes: "",
        });
      }, 1500);
    } catch (error) {
      if (error.status === 401 || error.error?.includes('Unauthorized') || error.error?.includes('authentication')) {
        alert("Session expired or authentication failed. Please login again.");
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/signup';
        return;
      }
      
      let errorMessage = "Failed to create appointment.";
      
      if (error.details) {
        errorMessage += "\n\nValidation errors:\n" + JSON.stringify(error.details, null, 2);
      } else if (error.error) {
        errorMessage += "\n\n" + (typeof error.error === 'object' ? JSON.stringify(error.error, null, 2) : error.error);
      } else if (error.message) {
        errorMessage += "\n\n" + error.message;
      }
      
      alert(errorMessage);
    }
  }

  function handleClose() {
    setFormData({
      caregiver: "",
      start_date: "",
      time: "",
      duration_type: "1day",
      notes: "",
    });
    setErrors({});
    onClose();
  }

  if (!isOpen) return null;

  return (
    <>
      {showSuccess && (
        <div className="success-toast">
          <span className="checkmark">✓</span>
        </div>
      )}
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Book Appointment</h2>
            <button className="modal-close" onClick={handleClose}>×</button>
          </div>
        
        <form onSubmit={handleSubmit} className="appointment-modal-form">
          <div className="form-group">
            <label htmlFor="modal_caregiver">Caregiver *</label>
            <select
              id="modal_caregiver"
              name="caregiver"
              value={formData.caregiver}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="">Select a caregiver</option>
              {caregivers.map(caregiver => (
                <option key={caregiver.id} value={caregiver.id}>
                  {caregiver.name} - {caregiver.speciality}
                </option>
              ))}
            </select>
            {errors.caregiver && <p className="error-text">{errors.caregiver}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="modal_start_date">Date *</label>
              <input
                type="date"
                id="modal_start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="form-input"
              />
              {errors.start_date && <p className="error-text">{errors.start_date}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="modal_time">Time *</label>
              <input
                type="time"
                id="modal_time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="form-input"
              />
              {errors.time && <p className="error-text">{errors.time}</p>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="modal_duration_type">Duration *</label>
            <select
              id="modal_duration_type"
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
            {errors.duration_type && <p className="error-text">{errors.duration_type}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="modal_notes">Notes (Optional)</label>
            <textarea
              id="modal_notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="form-input"
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn cancel">
              Cancel
            </button>
            <button type="submit" className="btn submit">
              Book Appointment
            </button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
}


