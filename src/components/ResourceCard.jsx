// // ResourceCard.jsx
// import React from "react";

// export default function ResourceCard({ resource, onSelect }) {
//   const isBloodResource = resource.type === "bloodbank" || resource.type === "hospital";

//   return (
//     <div
//       className="resource-card"
//       onClick={() => isBloodResource && onSelect(resource)}
//       style={{
//         cursor: isBloodResource ? "pointer" : "default",
//         border: "1px solid #e2e8f0",
//         borderRadius: 8,
//         padding: 12,
//         marginBottom: 8,
//         backgroundColor: "#f9fafb",
//         transition: "all 0.2s",
//       }}
//     >
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <div>
//           <strong style={{ fontSize: 16 }}>{resource.name}</strong> {isBloodResource && "💧"}
//           <div style={{ fontSize: 12, color: "#555" }}>
//             {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} • {resource.address || "N/A"}
//           </div>
//           {resource.phone && (
//             <div style={{ fontSize: 12, color: "#555" }}>📞 {resource.phone}</div>
//           )}
//         </div>
//         {resource.distanceKm && (
//           <div style={{ fontSize: 12, color: "#22c55e", minWidth: 50, textAlign: "right" }}>
//             {resource.distanceKm} km
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// ResourceCard.jsx
import React from "react";

export default function ResourceCard({ resource, onSelect }) {
  const typeLower = resource.type?.toLowerCase();
  const isBloodResource = ["bloodbank", "hospital"].includes(typeLower);

  return (
    <div
      className="resource-card clickable"
      onClick={() => isBloodResource && onSelect(resource)}
      style={{
        cursor: isBloodResource ? "pointer" : "default",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        backgroundColor: "#f9fafb",
        transition: "all 0.2s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          animation: "fadeIn 0.5s ease-in",
        }}
      >
        <div>
          <strong style={{ fontSize: 16 }}>
            {resource.name} {isBloodResource && "💧"}
          </strong>
          <div style={{ fontSize: 12, color: "#555" }}>
            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} •{" "}
            {resource.address || "N/A"}
          </div>
          {resource.phone && (
            <div style={{ fontSize: 12, color: "#555" }}>📞 {resource.phone}</div>
          )}
        </div>
        {resource.distanceKm && (
          <div
            style={{
              fontSize: 12,
              color: "#22c55e",
              minWidth: 50,
              textAlign: "right",
            }}
          >
            {resource.distanceKm} km
          </div>
        )}
      </div>
    </div>
  );
}
