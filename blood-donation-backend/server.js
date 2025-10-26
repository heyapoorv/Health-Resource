// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const { Resource, Booking } = require('./models');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // --- Routes ---

// // Get all resources with optional filter
// app.get('/api/resources', async (req, res) => {
//   try {
//     const { type, lat, lng, maxDistanceMeters } = req.query;

//     const filter = {};
//     if (type) filter.type = type;

//     let resources = await Resource.find(filter);

//     // Optional: calculate distance if lat/lng provided
//     if (lat && lng && maxDistanceMeters) {
//       const latNum = parseFloat(lat);
//       const lngNum = parseFloat(lng);
//       const maxDist = parseFloat(maxDistanceMeters);

//       resources = resources.map(r => {
//         if (r.lat && r.lng) {
//           const R = 6371000; // meters
//           const dLat = (r.lat - latNum) * Math.PI / 180;
//           const dLng = (r.lng - lngNum) * Math.PI / 180;
//           const a = Math.sin(dLat/2)**2 + Math.cos(latNum*Math.PI/180)*Math.cos(r.lat*Math.PI/180)*Math.sin(dLng/2)**2;
//           const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//           const distance = R * c; // meters
//           return {...r.toObject(), distance};
//         }
//         return {...r.toObject(), distance: null};
//       }).filter(r => r.distance === null || r.distance <= maxDist);
//     }

//     res.json(resources);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Create a booking
// // server.js

// app.post('/api/book', async (req, res) => {
//   try {
//     const { resourceId, ...rest } = req.body;
//     const booking = new Booking({ ...rest, resource: resourceId });
//     await booking.save();

//     // populate resource info
//     const populatedBooking = await booking.populate('resourceId');

//     res.status(201).json({
//       message: "Booking successful",
//       booking: populatedBooking
//     });
//   } catch(err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// // Optional: get all bookings
// // server.js

// app.get('/api/bookings', async (req, res) => {
//   const phone = req.query.phone;
//   if (!phone) return res.status(400).json({ error: "Phone number required" });

//   try {
//     const bookings = await Booking.find({ phone: req.query.phone })
//                               .populate('resourceId');
//     res.json(bookings);
//   } catch(err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// // --- Mongo + Server ---
// const PORT = process.env.PORT || 5000;

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected");
//     app.listen(PORT, ()=> console.log(`🚀 Server running on port ${PORT}`));
//   })
//   .catch(err => console.log(err));


// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { Resource, Booking } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// ===== ROUTES =====

// --- Get all resources ---
app.get('/api/resources', async (req, res) => {
  try {
    const { type, lat, lng, maxDistanceMeters } = req.query;
    const filter = {};
    if (type) filter.type = type;

    let resources = await Resource.find(filter);

    // Optional: calculate distance if lat/lng provided
    if (lat && lng && maxDistanceMeters) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const maxDist = parseFloat(maxDistanceMeters);

      resources = resources
        .map(r => {
          if (r.lat != null && r.lng != null) {
            const R = 6371000; // meters
            const dLat = (r.lat - latNum) * Math.PI / 180;
            const dLng = (r.lng - lngNum) * Math.PI / 180;
            const a = Math.sin(dLat / 2) ** 2 +
                      Math.cos(latNum * Math.PI / 180) *
                      Math.cos(r.lat * Math.PI / 180) *
                      Math.sin(dLng / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c; // meters
            return { ...r.toObject(), distance };
          }
          return { ...r.toObject(), distance: null };
        })
        .filter(r => r.distance === null || r.distance <= maxDist);
    }

    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Get single resource ---
app.get('/api/resources/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Create booking ---
app.post('/api/book', async (req, res) => {
  try {
    const { resourceId, ...rest } = req.body;

    if (!resourceId) return res.status(400).json({ error: "Resource ID is required" });

    const booking = new Booking({ ...rest, resourceId });
    await booking.save();

    const populatedBooking = await booking.populate('resourceId');

    res.status(201).json({
      message: "Booking successful",
      booking: populatedBooking
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Get bookings for a user by phone ---
app.get('/api/bookings', async (req, res) => {
  const { phone } = req.query;
  if (!phone) return res.status(400).json({ error: "Phone number required" });

  try {
    const bookings = await Booking.find({ phone })
      .sort({ createdAt: -1 })
      .populate('resourceId');

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== MONGO + SERVER START =====
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));
