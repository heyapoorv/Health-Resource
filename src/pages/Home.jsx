// import React, { useEffect, useState } from "react";
// import ResourceCard from "../components/ResourceCard";

// const API = import.meta.env.VITE_API_BASE || "/api";
// const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

// export default function Home() {
//   // --- state ---
//   const [coords, setCoords] = useState(null);
//   const [loadingLocation, setLoadingLocation] = useState(false);
//   const [resources, setResources] = useState([]);
//   const [filterType, setFilterType] = useState("all");
//   const [radiusKm, setRadiusKm] = useState(8);

//   const [selectedResource, setSelectedResource] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);

//   const [form, setForm] = useState({
//     name:"", phone:"", email:"", age:"", bloodGroup:"", date:"", time:"", requirement:"donate"
//   });
//   const [formError, setFormError] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [successMsg, setSuccessMsg] = useState("");

//   // --- geolocation ---
//   useEffect(() => {
//     const cached = sessionStorage.getItem("coords_v1");
//     if (cached) { setCoords(JSON.parse(cached)); return; }

//     setLoadingLocation(true);
//     if (!navigator.geolocation) { setLoadingLocation(false); return; }

//     navigator.geolocation.getCurrentPosition(
//       pos => {
//         const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
//         setCoords(c);
//         sessionStorage.setItem("coords_v1", JSON.stringify(c));
//         setLoadingLocation(false);
//       },
//       () => setLoadingLocation(false),
//       { timeout:10000 }
//     );
//   }, []);

//   useEffect(() => {
//     if (!coords) return;
//     fetchResources();
//   }, [coords, filterType, radiusKm]);

//   async function fetchResources() {
//     try {
//       setResources([]);
//       const params = new URLSearchParams({
//         lat: coords.lat,
//         lng: coords.lng,
//         type: filterType === "all" ? "" : filterType,
//         maxDistanceMeters: radiusKm * 1000
//       });
//       const res = await fetch(`${API}/resources?${params.toString()}`);
//       if (!res.ok) throw new Error("Failed to fetch resources");
//       const data = await res.json();
//       const mapped = data.map(r => ({ ...r, distanceKm: r.distance ? r.distance/1000 : null }));
//       setResources(mapped);
//     } catch(err) { console.error(err); }
//   }

//   // --- form handlers ---
//   function handleFormChange(e) {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   }

//   function validateForm() {
//     if (!form.name || form.name.trim().length < 2) return "Enter a valid name.";
//     if (!/^\d{10}$/.test(form.phone)) return "Phone must be 10 digits.";
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Invalid email.";
//     const ageNum = Number(form.age);
//     if (!ageNum || ageNum < 18 || ageNum > 65) return "Age must be between 18 and 65.";
//     if (!BLOOD_GROUPS.includes(form.bloodGroup)) return "Select blood group.";
//     if (!selectedResource) return "Select a resource to proceed.";
//     if (form.requirement === "donate" && (!form.date || !form.time)) return "Select date and time.";
//     return null;
//   }

//   async function submitBooking(e) {
//     e.preventDefault();
//     setFormError(null);
//     const err = validateForm();
//     if (err) { setFormError(err); return; }
//     setSubmitting(true); setSuccessMsg("");

//     try {
//       const payload = {
//         name: form.name.trim(),
//         phone: form.phone.trim(),
//         email: form.email.trim(),
//         age: Number(form.age),
//         bloodGroup: form.bloodGroup,
//         requirement: form.requirement,
//         resourceId: selectedResource._id,
//         date: form.date || null,
//         time: form.time || null,
//         location: coords || null
//       };
//       const res = await fetch(`${API}/book`, {
//         method:"POST",
//         headers:{"Content-Type":"application/json"},
//         body: JSON.stringify(payload)
//       });
//       const json = await res.json();
//       if (!res.ok) throw new Error(json?.error || "Server error");
//       setSuccessMsg("Booking successful. Reference: " + (json.booking?._id || "saved"));
//       setForm(prev => ({ ...prev, date:"", time:"" }));
//       setSelectedResource(null);
//       setModalOpen(false);
//     } catch(err) {
//       setFormError(err.message || "Failed to submit booking");
//     } finally { setSubmitting(false); }
//   }

//   // --- handle resource selection ---
//   function handleSelectResource(resource) {
//     if (resource.type === "bloodbank" || resource.type === "hospital") {
//       setSelectedResource(resource);
//       setModalOpen(true);
//     } else {
//       alert("Blood donation / emergency requests are only allowed at Blood Banks or Hospitals.");
//     }
//   }

//   function closeModal() {
//     setSelectedResource(null);
//     setModalOpen(false);
//   }

//   return (
//     <div className="home-grid">
//       {/* Left column: resources */}
//       <div>
//         <div style={{display:"flex", justifyContent:"space-between", marginBottom:16}}>
//           <div>
//             <h2>Nearby Resources</h2>
//             <div className="small">Automatically finds hospitals, blood banks and medical stores near you</div>
//           </div>

//           <div style={{display:"flex", gap:8, alignItems:"center"}}>
//             <label className="small">Filter:</label>
//             <select value={filterType} onChange={e=>setFilterType(e.target.value)}>
//               <option value="all">All</option>
//               <option value="bloodbank">Blood Banks</option>
//               <option value="hospital">Hospitals</option>
//               <option value="medical">Medical Stores</option>
//             </select>
//             <label className="small">Radius (km):</label>
//             <input type="number" min="1" max="50" value={radiusKm} onChange={e=>setRadiusKm(Number(e.target.value))} style={{width:70}} />
//           </div>
//         </div>

//         <ul className="resource-list">
//           {loadingLocation && <div className="small">Getting your location...</div>}
//           {!coords && !loadingLocation && <div className="small">Allow location to see nearby resources</div>}
//           {resources.length === 0 ? <div className="small">No resources found.</div> :
//             resources.map(r => (
//               <li key={r._id}>
//                 <ResourceCard resource={r} onSelect={handleSelectResource} />
//               </li>
//             ))
//           }
//         </ul>
//       </div>

//       {/* Right column: info */}
//       <aside>
//         <div className="card">
//           <h3>Health Tips 💚</h3>
//           <ul className="tips">
//             <li>Stay hydrated before donating blood.</li>
//             <li>3 months gap between donations.</li>
//             <li>Eat healthy before donation.</li>
//             <li>Bring a photo ID.</li>
//             <li>Avoid alcohol 24 hrs before donation.</li>
//             <li>Inform staff of medications.</li>
//           </ul>
//         </div>
//       </aside>


//       {/* Modal */}
//       {modalOpen && selectedResource && (
//         <div className="modal-backdrop" onClick={closeModal}>
//           <div className="modal-card" onClick={e=>e.stopPropagation()}>
//             <h3>Book / Request Blood at {selectedResource.name} 💧</h3>
//             <form onSubmit={submitBooking}>
//               <div className="form-row">
//                 <input name="name" placeholder="Name" value={form.name} onChange={handleFormChange} />
//                 <input name="phone" placeholder="Phone (10 digits)" value={form.phone} onChange={handleFormChange} />
//               </div>
//               <div className="form-row">
//                 <input name="email" placeholder="Email" value={form.email} onChange={handleFormChange} />
//                 <input name="age" placeholder="Age" value={form.age} onChange={handleFormChange} />
//               </div>
//               <div className="form-row">
//                 <select name="bloodGroup" value={form.bloodGroup} onChange={handleFormChange}>
//                   <option value="">Select Blood Group</option>
//                   {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
//                 </select>
//                 <select name="requirement" value={form.requirement} onChange={handleFormChange}>
//                   <option value="donate">Donate Blood</option>
//                   <option value="request">Request Blood</option>
//                   <option value="emergency">Emergency</option>
//                 </select>
//               </div>

//               {form.requirement === "donate" && (
//                 <div className="form-row">
//                   <input name="date" type="date" value={form.date} onChange={handleFormChange} />
//                   <input name="time" type="time" value={form.time} onChange={handleFormChange} />
//                 </div>
//               )}

//               {formError && <div style={{color:"crimson", marginBottom:8}}>{formError}</div>}
//               {successMsg && <div style={{color:"green", marginBottom:8}}>{successMsg}</div>}

//               <div className="form-actions">
//                 <button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Book / Submit"}</button>
//                 <button type="button" onClick={closeModal}>Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import ResourceCard from "../components/ResourceCard";

const API = import.meta.env.VITE_API_BASE || "/api";
const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

export default function Home() {
  // --- state ---
  const [coords, setCoords] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [resources, setResources] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [radiusKm, setRadiusKm] = useState(8);

  const [selectedResource, setSelectedResource] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    name:"", phone:"", email:"", age:"", bloodGroup:"", date:"", time:"", requirement:"donate"
  });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // --- My Bookings ---
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // --- geolocation ---
  useEffect(() => {
    const cached = sessionStorage.getItem("coords_v1");
    if (cached) { setCoords(JSON.parse(cached)); return; }

    setLoadingLocation(true);
    if (!navigator.geolocation) { setLoadingLocation(false); return; }

    navigator.geolocation.getCurrentPosition(
      pos => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(c);
        sessionStorage.setItem("coords_v1", JSON.stringify(c));
        setLoadingLocation(false);
      },
      () => setLoadingLocation(false),
      { timeout:10000 }
    );
  }, []);

  useEffect(() => {
    if (!coords) return;
    fetchResources();
  }, [coords, filterType, radiusKm]);

  // --- fetch resources ---
 // --- fetch resources ---
async function fetchResources() {
  if (!coords) return;

  try {
    setResources([]);

    const params = new URLSearchParams({
      lat: coords.lat,
      lng: coords.lng,
      type: filterType === "all" ? "" : filterType,
      maxDistanceMeters: radiusKm * 1000
    });

    const res = await fetch(`${API}/resources?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch resources");

    const data = await res.json(); // valid JSON from backend

    // calculate distance in km if lat/lng provided
    const mapped = data.map(r => {
      if (r.lat && r.lng) {
        const R = 6371;
        const dLat = (r.lat - coords.lat) * Math.PI / 180;
        const dLng = (r.lng - coords.lng) * Math.PI / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(coords.lat * Math.PI / 180) *
          Math.cos(r.lat * Math.PI / 180) *
          Math.sin(dLng / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = R * c;
        return { ...r, distanceKm: distanceKm.toFixed(2) };
      }
      return { ...r, distanceKm: null };
    });

    setResources(mapped);
  } catch (err) {
    console.error("Error fetching resources:", err);
  }
}


  // --- form handlers ---
  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    if (!form.name || form.name.trim().length < 2) return "Enter a valid name.";
    if (!/^\d{10}$/.test(form.phone)) return "Phone must be 10 digits.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Invalid email.";
    const ageNum = Number(form.age);
    if (!ageNum || ageNum < 18 || ageNum > 65) return "Age must be between 18 and 65.";
    if (!BLOOD_GROUPS.includes(form.bloodGroup)) return "Select blood group.";
    if (!selectedResource) return "Select a resource to proceed.";
    if (form.requirement === "donate" && (!form.date || !form.time)) return "Select date and time.";
    return null;
  }

  async function submitBooking(e) {
  e.preventDefault();
  setFormError(null);
  const err = validateForm();
  if (err) { setFormError(err); return; }

  setSubmitting(true);
  setSuccessMsg("");
  // After setSuccessMsg(...) 
fetchMyBookings(); // Refresh bookings live


  try {
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      age: Number(form.age),
      bloodGroup: form.bloodGroup,
      requirement: form.requirement,
      resourceId: selectedResource._id,
      date: form.date || null,
      time: form.time || null,
      location: coords || null
    };

    const res = await fetch(`${API}/book`, { // <--- correct endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await res.json();

    if (!res.ok) throw new Error(json?.error || "Server error");

    setSuccessMsg("Booking successful. Reference: " + (json.booking?.referenceId || "saved"));
    setForm(prev => ({ ...prev, date:"", time:"" }));
    setSelectedResource(null);
    setModalOpen(false);

  } catch(err) {
    setFormError(err.message || "Failed to submit booking");
  } finally {
    setSubmitting(false);
  }
}

  // --- handle resource selection ---
  function handleSelectResource(resource) {
  const typeLower = resource.type.toLowerCase();
  if (typeLower === "bloodbank" || typeLower === "hospital") {
    setSelectedResource(resource);
    setModalOpen(true);
  } else {
    alert("Blood donation / emergency requests are only allowed at Blood Banks or Hospitals.");
  }
}


  function closeModal() {
    setSelectedResource(null);
    setModalOpen(false);
  }

  // --- fetch my bookings ---
async function fetchMyBookings() {
  if (!phone || phone.trim().length !== 10) {
    return alert("Enter a valid 10-digit phone number");
  }
  setLoadingBookings(true);
  try {
    const res = await fetch(`${API}/bookings?phone=${phone}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to fetch bookings");
    }
    const data = await res.json();
    setBookings(data);
  } catch (err) {
    console.error(err);
    alert(err.message);
    setBookings([]);
  } finally {
    setLoadingBookings(false);
  }
}



  return (
    <div className="home-grid">
      {/* Left column */}
      <div className="resources-column">
        <div className="resources-header">
          <h2>Nearby Resources</h2>
          <div className="small">Automatically finds hospitals, blood banks, and medical stores near you</div>
          <div className="filter-controls">
            <label>Filter:</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="all">All</option>
              <option value="bloodbank">Blood Banks</option>
              <option value="hospital">Hospitals</option>
              <option value="medical">Medical Stores</option>
            </select>
            <label>Radius (km):</label>
            <input
              type="number"
              min="1"
              max="50"
              value={radiusKm}
              onChange={e => setRadiusKm(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="resources-list">
          {loadingLocation && <div className="small">Getting your location...</div>}
          {!coords && !loadingLocation && <div className="small">Allow location to see nearby resources</div>}
          {resources.length === 0 ? <div className="small">No resources found.</div> :
            resources.map(r => <ResourceCard key={r._id} resource={r} onSelect={handleSelectResource} />)
          }
        </div>
      </div>

      {/* Right column */}
      <aside className="aside-column">
        {/* Health Tips */}
        <div className="card">
          <h3>Health Tips 💚</h3>
          <ul className="tips">
            <li>Stay hydrated before donating blood.</li>
            <li>3 months gap between donations.</li>
            <li>Eat healthy before donation.</li>
            <li>Bring a photo ID.</li>
            <li>Avoid alcohol 24 hrs before donation.</li>
            <li>Inform staff of medications.</li>
          </ul>
        </div>

        {/* My Bookings */}
       <div className="card bookings-card">
  <h3>My Bookings 📝</h3>

  <div className="booking-form">
    <input
      type="text"
      placeholder="Enter your phone number"
      value={phone}
      onChange={e => setPhone(e.target.value)}
      onKeyDown={e => e.key === "Enter" && fetchMyBookings()}
    />
    <button onClick={fetchMyBookings}>Fetch Bookings</button>
  </div>

<div className="bookings-list">
  {loadingBookings && <div className="small">Loading bookings...</div>}
  {!loadingBookings && bookings.length === 0 && <div className="small">No bookings found.</div>}
  <ul>
    {bookings.map(b => {
      const dateStr = b.date ? new Date(b.date).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric"
      }) : "-";

      const timeStr = b.time || "-";

      return (
        <li key={b._id} style={{
          marginBottom: "12px",
          padding: "8px",
          border: "1px solid #e2e8f0",
          borderRadius: "6px",
          backgroundColor: "#f9fafb"
        }}>
          <div><strong>Resource:</strong> {b.resourceId?.name || "N/A"}</div>
          <div><strong>Requirement:</strong> {b.requirement.charAt(0).toUpperCase() + b.requirement.slice(1)}</div>
          <div><strong>Date/Time:</strong> {dateStr} {timeStr !== "-" ? timeStr : ""}</div>
          <div><strong>Ref:</strong> {b.referenceId}</div>
        </li>
      );
    })}
  </ul>
</div>


</div>

      </aside>

      {/* Modal */}
      {modalOpen && selectedResource && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card" onClick={e=>e.stopPropagation()}>
            <h3>Book / Request Blood at {selectedResource.name} 💧</h3>
            <form onSubmit={submitBooking}>
              <div className="form-row">
                <input name="name" placeholder="Name" value={form.name} onChange={handleFormChange} />
                <input name="phone" placeholder="Phone (10 digits)" value={form.phone} onChange={handleFormChange} />
              </div>
              <div className="form-row">
                <input name="email" placeholder="Email" value={form.email} onChange={handleFormChange} />
                <input name="age" placeholder="Age" value={form.age} onChange={handleFormChange} />
              </div>
              <div className="form-row">
                <select name="bloodGroup" value={form.bloodGroup} onChange={handleFormChange}>
                  <option value="">Select Blood Group</option>
                  {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <select name="requirement" value={form.requirement} onChange={handleFormChange}>
                  <option value="donate">Donate Blood</option>
                  <option value="request">Request Blood</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              {form.requirement === "donate" && (
                <div className="form-row">
                  <input name="date" type="date" value={form.date} onChange={handleFormChange} />
                  <input name="time" type="time" value={form.time} onChange={handleFormChange} />
                </div>
              )}

              {formError && <div style={{color:"crimson", marginBottom:8}}>{formError}</div>}
              {successMsg && <div style={{color:"green", marginBottom:8}}>{successMsg}</div>}

              <div className="form-actions" style={{display:"flex", gap:8}}>
                <button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Book / Submit"}</button>
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
