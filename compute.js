// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnFvGMImnUQoe8dGtq32Yz-a8_6bMtjFQ",
  authDomain: "projectyelamudhram.firebaseapp.com",
  databaseURL: "https://projectyelamudhram-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "projectyelamudhram",
  storageBucket: "projectyelamudhram.firebasestorage.app",
  messagingSenderId: "583393678546",
  appId: "1:583393678546:web:4c877bbfba740ed375890b",
  measurementId: "G-4GCSQCJFF0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const userLocation = {
  lat: 16.5062,
  lng: 80.6480
};

function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function calculateScore(beds, icu, specialists, distanceKm) {
  const distanceScore = Math.max(0, 10 - distanceKm);
  
  // FORMULA
  return (beds * 0.35 + icu * 0.30 + specialists * 0.20 + distanceScore * 0.15).toFixed(2);}

document.getElementById("find").addEventListener("click", async () => {
  const specialist = document.getElementById("specialists").value;
  const resultsDiv = document.getElementById("computeresults");
  resultsDiv.innerHTML = "";

  const snapshot = await get(ref(db, "/"));
  const data = snapshot.val();

  Object.values(data).forEach((hospitalArr) => {
    const hospital = hospitalArr[0];

    const beds = hospital.availability.beds;
    const icu = hospital.availability.icu_beds;
    const specialistsOnDuty =
      hospital.availability.specialists[specialist] || 0;

    const dist = distanceKm(
      userLocation.lat,
      userLocation.lng,
      hospital.coordinates.lat,
      hospital.coordinates.lng
    );

    const score = calculateScore(
      beds,
      icu,
      specialistsOnDuty,
      dist
    );

    const div = document.createElement("div");
    div.className = "hospital";
    div.innerHTML = `
      <strong>${hospital.hospital_name}</strong><br/>
      Distance: ${dist.toFixed(2)} km<br/>
      Beds: ${beds}, ICU: ${icu}<br/>
      ${specialist} specialists: ${specialistsOnDuty}<br/>
      <b>Score: ${score}</b>
    `;

    resultsDiv.appendChild(div);
  });
});