import { useState } from "react";
import "./HospitalDashboard.css";

export default function HospitalDashboard() {
  const [formData, setFormData] = useState({
    hospital: "",
    availableBeds: "",
    icuBeds: "",
    neurology: "",
    cardiac: "",
    orthopedic: "",
    status: "Ready"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Hospital Data Updated Successfully 🚑");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>🏥 Hospital Control Panel</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Hospital</label>
            <select name="hospital" onChange={handleChange} required>
              <option value="">Choose Hospital</option>
              <option>City Hospital</option>
              <option>Apollo Hospital</option>
              <option>General Medical Center</option>
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Available Beds</label>
              <input type="number" name="availableBeds" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>ICU Beds</label>
              <input type="number" name="icuBeds" onChange={handleChange} required />
            </div>
          </div>

          <h4>Specialists Availability</h4>

          <div className="grid-3">
            <input type="number" name="neurology" placeholder="Neurology" onChange={handleChange} />
            <input type="number" name="cardiac" placeholder="Cardiac" onChange={handleChange} />
            <input type="number" name="orthopedic" placeholder="Orthopedic" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" onChange={handleChange}>
              <option value="Ready">🟢 Ready</option>
              <option value="Filling Fast">🟡 Filling Fast</option>
              <option value="Busy">🔴 Busy</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Update Hospital Status
          </button>
        </form>
      </div>
    </div>
  );
}