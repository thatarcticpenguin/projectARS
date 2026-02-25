import React, { useState, useEffect } from "react";

// ── Spin keyframe injected once ──────────────────────────────────────────────
function injectSpinKeyframe() {
  if (document.getElementById("spin-keyframes")) return;
  const style = document.createElement("style");
  style.id = "spin-keyframes";
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}

const PatientForm = ({ onSubmit }) => {
  const [dept, setDept] = useState("general_medicine");
  const [disease, setDisease] = useState("");
  const [severity, setSeverity] = useState("critical");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null); // { lat, lng }
  const [locStatus, setLocStatus] = useState("detecting"); // "detecting" | "ready" | "error"
  const [paramedic, setParamedic] = useState(null); // Paramedic info from session

  // Full department → conditions map
  const departmentData = {
    general_medicine: ["Unknown/Trauma", "Unconscious", "Severe Fever", "Infection", "Dehydration"],
    cardiology: ["Heart Attack", "Cardiac Arrest", "Chest Pain", "Arrhythmia", "Heart Failure"],
    neurology: ["Stroke", "Seizure", "Head Trauma", "Migraine", "Meningitis"],
    orthopedics: ["Fracture", "Spinal Injury", "Dislocation", "Ligament Tear", "Bone Infection"],
    pulmonology: ["Asthma Attack", "Pneumonia", "Respiratory Failure", "COPD", "Pulmonary Embolism"],
    gastroenterology: ["Appendicitis", "GI Bleeding", "Bowel Obstruction", "Severe Gastritis", "Pancreatitis"],
    nephrology: ["Acute Kidney Failure", "Kidney Stone", "Urinary Tract Infection", "Dialysis Emergency"],
    urology: ["Urinary Retention", "Kidney Stone", "Bladder Injury", "Testicular Torsion"],
    endocrinology: ["Diabetic Ketoacidosis", "Hypoglycemia", "Thyroid Storm", "Adrenal Crisis"],
    dermatology: ["Severe Burns", "Anaphylaxis", "Toxic Skin Reaction", "Infected Wound"],
    pediatrics: ["High Fever (Child)", "Febrile Seizure", "Respiratory Distress (Child)", "Dehydration (Child)"],
    gynecology: ["Ectopic Pregnancy", "Labor Emergency", "Severe Hemorrhage", "Ovarian Torsion"],
    ent: ["Airway Obstruction", "Severe Nosebleed", "Ear Trauma", "Throat Abscess"],
    ophthalmology: ["Eye Trauma", "Sudden Vision Loss", "Chemical Burn (Eye)", "Retinal Detachment"],
    psychiatry: ["Suicidal Crisis", "Acute Psychosis", "Severe Panic Attack", "Violent Behavior"],
    oncology: ["Chemotherapy Complication", "Tumor Bleeding", "Neutropenic Fever", "Bowel Obstruction"],
    radiology: ["Imaging Emergency", "Contrast Reaction", "Intervention Complication"],
    anesthesiology: ["Post-Op Complication", "Anesthesia Reaction", "Airway Emergency", "Pain Crisis"],
  };

  const departments = Object.keys(departmentData);

  // Inject spin animation
  useEffect(() => {
    injectSpinKeyframe();
    
    // Fetch paramedic info from sessionStorage
    const paramedicsData = sessionStorage.getItem("paramedic");
    if (paramedicsData) {
      setParamedic(JSON.parse(paramedicsData));
    }
  }, []);

  // Auto-detect GPS location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLocStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoords({ lat: latitude, lng: longitude });
        setLocStatus("ready");
        setError("");
      },
      (err) => {
        const msgs = {
          1: "Location access denied — please allow it in browser settings.",
          2: "Location unavailable right now. Try again.",
          3: "Location request timed out.",
        };
        setError(msgs[err.code] ?? "Could not detect location.");
        setLocStatus("error");
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }, []);

  // Reset disease when department changes
  useEffect(() => {
    setDisease(departmentData[dept]?.[0] ?? "");
  }, [dept]);

  // ── Google Translate setup ───────────────────────────────────────────────
  useEffect(() => {
    // Prevent duplicate script loading
    if (document.getElementById("google-translate-script")) return;

    // Define the initialization function (must be global)
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          // Add the languages you want (common Indian + some others)
          includedLanguages: "en,hi,te,ta,kn,mr,bn,gu,pa,or,as,ml",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    // Load Google Translate script
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // Optional cleanup (usually not needed)
    return () => {
      const existing = document.getElementById("google-translate-script");
      if (existing) existing.remove();
      delete window.googleTranslateElementInit;
    };
  }, []);

  const handleInstantRescue = () => {
    if (!coords) {
      setError("Location not available – cannot proceed.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      onSubmit({
        dept: "general_medicine",
        disease: "Unknown/Trauma",
        severity: "critical",
        location: coords,
        isGoldenHour: true,
        paramedic: paramedic,
      });
      setLoading(false);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!coords) {
      setError("Location not available – cannot search.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      onSubmit({ 
        dept, 
        disease, 
        severity, 
        location: coords,
        paramedic: paramedic,
      });
      setLoading(false);
    }, 1500);
  };

  const formatDeptLabel = (d) =>
    d.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const isDisabled = loading || locStatus !== "ready";

  return (
    <div style={styles.card}>
      {/* Google Translate dropdown */}
      <div
        id="google_translate_element"
        style={{
          position: "fixed",
          top: "16px",
          right: "16px",
          zIndex: 9999,
          fontSize: "14px",
        }}
      />

      {paramedic && (
        <div style={{ marginBottom: "12px", padding: "12px", background: "#eff6ff", borderRadius: "8px", borderLeft: "4px solid #3b82f6" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "#1e40af", fontWeight: "500" }}>
            Welcome, <strong>{paramedic.name}</strong>! 👋
          </p>
        </div>
      )}

      <h2 style={styles.title}>
        <span style={{ fontSize: "2rem" }}>🚑</span> Emergency Patient Intake
      </h2>

      {/* Location status banner */}
      {locStatus === "detecting" && (
        <div style={{ ...styles.banner, background: "#fef9c3", color: "#92400e", borderColor: "#fde68a" }}>
          <div style={styles.spinner} /> Detecting your location…
        </div>
      )}
      {locStatus === "ready" && (
        <div style={{ ...styles.banner, background: "#dcfce7", color: "#166534", borderColor: "#86efac" }}>
          📍 Location detected — ready to go
        </div>
      )}
      {locStatus === "error" && (
        <div style={{ ...styles.banner, background: "#fee2e2", color: "#991b1b", borderColor: "#fca5a5" }}>
          ⚠ {error}
        </div>
      )}

      {/* Golden Hour button */}
      <button
        type="button"
        onClick={handleInstantRescue}
        disabled={isDisabled}
        style={{ ...styles.goldenButton, opacity: isDisabled ? 0.55 : 1 }}
      >
        {loading && <div style={styles.spinner} />}
        🚨 INSTANT RESCUE – GOLDEN HOUR
      </button>

      {/* Regular form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <label htmlFor="department" style={styles.label}>Department</label>
        <select id="department" value={dept} onChange={(e) => setDept(e.target.value)} style={styles.input}>
          {departments.map((d) => (
            <option key={d} value={d}>{formatDeptLabel(d)}</option>
          ))}
        </select>

        <label htmlFor="condition" style={styles.label}>Condition / Disease</label>
        <select id="condition" value={disease} onChange={(e) => setDisease(e.target.value)} style={styles.input}>
          {departmentData[dept]?.map((dis) => (
            <option key={dis} value={dis}>{dis}</option>
          ))}
        </select>

        <label htmlFor="severity" style={styles.label}>Severity</label>
        <select id="severity" value={severity} onChange={(e) => setSeverity(e.target.value)} style={styles.input}>
          <option value="critical">🔴 Critical</option>
          <option value="moderate">🟡 Moderate</option>
          <option value="stable">🟢 Stable</option>
        </select>

        <button
          type="submit"
          disabled={isDisabled}
          style={{ ...styles.submitButton, opacity: isDisabled ? 0.6 : 1 }}
        >
          {loading && <div style={styles.spinner} />}
          {loading ? "Finding nearest help…" : "🔍 Search Facilities"}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: "13px", color: "#9ca3af", marginTop: "8px" }}>
        Made with ❤️ for faster emergency care
      </p>
    </div>
  );
};

const styles = {
  card: {
    maxWidth: "540px",
    margin: "auto",
    padding: "32px",
    borderRadius: "16px",
    background: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  title: {
    textAlign: "center",
    margin: 0,
    color: "#1e293b",
    fontSize: "1.9rem",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },
  banner: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid",
    fontSize: "14px",
    fontWeight: "500",
  },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  label: { fontSize: "15px", fontWeight: "700", color: "#334155" },
  input: {
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.2s",
  },
  submitButton: {
    padding: "16px",
    borderRadius: "10px",
    border: "none",
    background: "#0f172a",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    marginTop: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  goldenButton: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "16px 24px",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "17px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "opacity 0.2s",
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "3px solid rgba(255,255,255,0.35)",
    borderTop: "3px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    flexShrink: 0,
  },
};

export default PatientForm;