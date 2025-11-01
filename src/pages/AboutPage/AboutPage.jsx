import "./AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-sections-container">
      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          GoldenCare is dedicated to transforming elderly homecare across Saudi Arabia. We connect families with carefully vetted, compassionate caregivers who deliver professional, dignified care in the comfort of your loved one's home.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Goal</h2>
        <p>
          We provide the highest quality homecare services for elderly individuals across Saudi Arabia, treating every client with compassion and respect. We enhance independence through personalized care plans and support families with reliable professional caregivers.
        </p>
      </section>

      <section className="about-section">
        <h2>Data Protection & Security</h2>
        <p>
          All appointments, messages, and patient data are handled through encrypted solutions. Our platform follows international healthcare compliance standards to ensure the highest level of data protection and patient confidentiality.
        </p>
      </section>

      <section className="about-section">
        <h2>Electronic Health Records</h2>
        <p>
          Our comprehensive EHR system serves as a centralized digital hub for all care-related information. Care reports, medication schedules, medical history, and daily care notes are securely stored and accessible only to authorized family members and healthcare providers.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Caregivers</h2>
        <p>
          Every caregiver is thoroughly vetted and holds relevant healthcare certifications. They are CPR and First Aid certified, culturally sensitive to Saudi values, and experienced in personal care, medication management, and companionship.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Services</h2>
        <p>
          We provide comprehensive elderly homecare services including medical support, personal care assistance, companionship, and flexible care options ranging from hourly visits to 24/7 live-in care.
        </p>
      </section>

      <section className="about-section">
        <h2>Currently Serving</h2>
        <ul className="cities-list">
          <li>Riyadh, Saudi Arabia</li>
          <li>Al-Ahsa, Saudi Arabia</li>
        </ul>
        <p className="expanding-text">Expanding to more cities across the Kingdom soon.</p>
      </section>

      <section className="about-section partners-section">
        <h2>Our Partners</h2>
        <div className="partners-container">
        </div>
      </section>
      </div>
    </div>
  );
}

