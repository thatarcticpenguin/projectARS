import { useState, useEffect } from "react";
import "./hospitaldashboard.css";
import { ref, update, get, onValue } from "firebase/database";
import { db } from "./firebase";

// 🏥 Departments config: UI id, label, and Firebase specialists key
const DEPARTMENTS = [
  { id: "general_medicine", label: "General Medicine", dbKey: "general" },
  { id: "cardiology", label: "Cardiology", dbKey: "cardiac" },
  { id: "neurology", label: "Neurology", dbKey: "neurology" },
  { id: "orthopedics", label: "Orthopedics", dbKey: "orthopedic" },
  { id: "pulmonology", label: "Pulmonology", dbKey: "pulmonology" },
  { id: "gastroenterology", label: "Gastroenterology", dbKey: "gastroenterology" },
  { id: "nephrology", label: "Nephrology", dbKey: "nephrology" },
  { id: "urology", label: "Urology", dbKey: "urology" },
  { id: "endocrinology", label: "Endocrinology", dbKey: "endocrinology" },
  { id: "dermatology", label: "Dermatology", dbKey: "dermatology" },
  { id: "pediatrics", label: "Pediatrics", dbKey: "pediatrics" },
  { id: "gynecology", label: "Gynecology", dbKey: "gynecology" },
  { id: "ent", label: "ENT", dbKey: "ent" },
  { id: "ophthalmology", label: "Ophthalmology", dbKey: "ophthalmology" },
  { id: "psychiatry", label: "Psychiatry", dbKey: "psychiatry" },
  { id: "oncology", label: "Oncology", dbKey: "oncology" },
  { id: "radiology", label: "Radiology", dbKey: "radiology" },
  { id: "anesthesiology", label: "Anesthesiology", dbKey: "anesthesiology" }
];

export default function HospitalDashboard() {
  const [formData, setFormData] = useState({
    hospital: "",
    availableBeds: "",
    icuBeds: "",
    status: "Ready",
    specialists: DEPARTMENTS.reduce((acc, d) => {
      acc[d.id] = "";
      return acc;
    }, {})
  });

  const [hospitalsSnapshot, setHospitalsSnapshot] = useState(null);
  const [hospitalOptions, setHospitalOptions] = useState([]);

  // 🔁 Live subscription to all hospitals so we always have最新 data
  useEffect(() => {
    const hospitalsRef = ref(db, "/hospitals");
    const unsubscribe = onValue(hospitalsRef, (snapshot) => {
      const raw = snapshot.val() || {};
      setHospitalsSnapshot(raw);

      // Build options from live DB: key = "hospital1", label = hospital_name
      const opts = Object.entries(raw)
        .map(([key, arr]) => {
          const hospital = Array.isArray(arr) ? arr[0] : null;
          if (!hospital || !hospital.hospital_name) return null;
          return { key, label: hospital.hospital_name };
        })
        .filter(Boolean);

      setHospitalOptions(opts);
    });
    return () => unsubscribe();
  }, []);

  const applyHospitalDataToForm = (hospitalKey, hospitalName, rootData) => {
    const hospitalArr = rootData?.[hospitalKey];
    const data = Array.isArray(hospitalArr) ? hospitalArr[0] : null;
    if (!data) return;

    setFormData((prev) => {
      const specialistsFromDb = data?.availability?.specialists || {};
      const specialistsState = { ...prev.specialists };

      DEPARTMENTS.forEach((d) => {
        specialistsState[d.id] = specialistsFromDb[d.dbKey] ?? "";
      });

      return {
        ...prev,
        hospital: hospitalName,
        availableBeds: data?.availability?.beds ?? "",
        icuBeds: data?.availability?.icu_beds ?? "",
        status: data?.status ?? "Ready",
        specialists: specialistsState
      };
    });
  };

  const fetchHospitalData = async (hospitalKey, hospitalName) => {
    // Prefer live snapshot if we already have it
    if (hospitalsSnapshot) {
      applyHospitalDataToForm(hospitalKey, hospitalName, hospitalsSnapshot);
      return;
    }

    // Fallback one-time fetch
    const hospitalRef = ref(db, `/hospitals/${hospitalKey}/0`);
    const snapshot = await get(hospitalRef);
    if (snapshot.exists()) {
      const single = snapshot.val();
      applyHospitalDataToForm(hospitalKey, hospitalName, {
        [hospitalKey]: [single]
      });
    }
  };

  const handleHospitalChange = async (e) => {
    const hospitalName = e.target.value;
    const hospitalEntry = hospitalOptions.find((h) => h.label === hospitalName);
    const hospitalKey = hospitalEntry?.key;

    setFormData((prev) => ({
      ...prev,
      hospital: hospitalName
    }));

    if (hospitalKey) {
      await fetchHospitalData(hospitalKey, hospitalName);
    }
  };

  // When user types a hospital name and presses Enter,
  // update the form with that hospital's data instead of submitting the whole form.
  const handleHospitalKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleHospitalChange(e);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSpecialistChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specialists: {
        ...prev.specialists,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hospitalEntry = hospitalOptions.find(
      (h) => h.label === formData.hospital
    );
    const hospitalKey = hospitalEntry?.key;
    if (!hospitalKey) {
      alert("Invalid hospital selected");
      return;
    }

    const hospitalRef = ref(db, `/hospitals/${hospitalKey}/0`);

    const updates = {
      // 🔁 Update just the fields we care about, preserving other data
      "availability/beds": Number(formData.availableBeds),
      "availability/icu_beds": Number(formData.icuBeds),
      status: formData.status,
      // ⏱ Keep a human-readable timestamp alongside any existing field
      last_updated: new Date().toISOString(),
      last_updated_ms: Date.now()
    };

    DEPARTMENTS.forEach((d) => {
      const value = Number(formData.specialists[d.id] || 0);
      updates[`availability/specialists/${d.dbKey}`] = value;
    });

    await update(hospitalRef, updates);

    alert("Hospital Data Updated Successfully 🚑");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>🏥 Hospital Control Panel</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Hospital</label>
            <input
              list="hospital-list"
              name="hospital"
              value={formData.hospital}
              onChange={handleHospitalChange}
              onKeyDown={handleHospitalKeyDown}
              autoComplete="off"
              placeholder="Search and select hospital..."
              required
            />
            <datalist id="hospital-list">
              {hospitalOptions.map((h) => (
                <option key={h.key} value={h.label} />
              ))}
            </datalist>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Available Beds</label>
              <input
                type="number"
                name="availableBeds"
                value={formData.availableBeds}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>ICU Beds</label>
              <input
                type="number"
                name="icuBeds"
                value={formData.icuBeds}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <h4>Specialists Availability</h4>

          <div className="grid-3">
            {DEPARTMENTS.map((d) => (
              <input
                key={d.id}
                type="number"
                name={d.id}
                placeholder={d.label}
                value={formData.specialists[d.id]}
                onChange={handleSpecialistChange}
              />
            ))}
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
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