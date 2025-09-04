import React, { useEffect, useState } from "react";
import "../Styles/AdminDashboard.css";

const BookingsTab = () => {
  const [bookings, setBookings] = useState([]);

  // Fetch all bookings
  useEffect(() => {
    console.log("Fetching bookings..."); // Add this to check if useEffect is being triggered

    fetch("http://localhost/AI_ChatBot/AdminApi/bookings.php")
      .then((res) => {
        console.log("Response status:", res.status); // Check if the request is actually going through
        return res.json();
      })
      .then((data) => {
        console.log("Fetched bookings:", data); // Check the data received
        setBookings(data);
      })
      .catch((err) => console.error("Error loading bookings:", err));
  }, []);

  const handleStatusChange = (bookingId, newStatus) => {
    fetch("http://localhost/AI_ChatBot/AdminApi/bookings.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id: bookingId, status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setBookings((prev) =>
            prev.map((b) =>
              b.booking_id === bookingId ? { ...b, status: newStatus } : b
            )
          );
        } else {
          alert("Failed to update status.");
        }
      })
      .catch((err) => console.error("Error updating status:", err));
  };

  return (
    <div className="bookings-tab">
      <h2>All Bookings</h2>
      <div className="wrap">
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.booking_id} className="booking-card">
              <p>
                <strong>User:</strong> {booking.user_name}
              </p>
              <p>
                <strong>Package:</strong> {booking.package_name}
              </p>
              <p>
                <strong>Booking Date:</strong> {booking.booking_date}
              </p>
              <p>
                <strong>Travel Date:</strong> {booking.travel_date}
              </p>
              <p>
                <strong>People:</strong> {booking.num_people}
              </p>
              <p>
                <strong>Total Price:</strong> ${booking.total_price}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <select
                  value={booking.status}
                  onChange={(e) =>
                    handleStatusChange(booking.booking_id, e.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingsTab;
