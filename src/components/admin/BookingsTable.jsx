import { useEffect, useState } from "react";
import { Search, Calendar, AlertTriangle, MessageSquare, AlertCircle } from "lucide-react";
import { getAllBookings } from "../../services/adminService";
import { sendReminderEmail, markNotReturned, reportRenter } from "../../api/bookingApi";

export default function BookingsTable() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await getAllBookings();
      if (res.data && res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemind = async (id) => {
    try {
      await sendReminderEmail(id);
      alert("Reminder sent successfully!");
    } catch (error) {
      alert("Failed to send reminder.");
    }
  };

  const handleMarkNotReturned = async (id) => {
    try {
      await markNotReturned(id);
      alert("Marked as Not Returned and late fee applied!");
      loadBookings();
    } catch (error) {
      alert("Failed to mark as not returned.");
    }
  };

  const handleReportRenter = async (id) => {
    if (!window.confirm("Are you sure you want to report this renter?")) return;
    try {
      const res = await reportRenter(id);
      alert(res.message || "Renter reported successfully.");
      loadBookings();
    } catch (error) {
      alert("Failed to report renter.");
    }
  };

  const filtered = bookings.filter((booking) => {
    const itemName = booking.tool?.name || booking.skill?.title || "";
    const renterName = booking.renter?.name || "";
    const ownerName = booking.owner?.name || "";
    return (
      itemName.toLowerCase().includes(search.toLowerCase()) ||
      renterName.toLowerCase().includes(search.toLowerCase()) ||
      ownerName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bookings</h2>

        <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search bookings..."
            className="ml-2 bg-transparent outline-none w-48"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-4 text-left">Item</th>
              <th className="text-left">Renter</th>
              <th className="text-left">Owner</th>
              <th className="text-left">Dates</th>
              <th className="text-left">Status</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-500">
                  Loading bookings...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-500">
                  No bookings found.
                </td>
              </tr>
            ) : (
              filtered.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-slate-50 transition">
                  <td className="p-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Calendar size={18} className="text-blue-600" />
                      </div>
                      {booking.tool?.name || booking.skill?.title || "Unknown Item"}
                    </div>
                  </td>
                  <td className="text-sm text-slate-600">{booking.renter?.name || "Unknown Renter"}</td>
                  <td className="text-sm text-slate-600">{booking.owner?.name || "Unknown Owner"}</td>
                  <td className="text-sm text-slate-600">
                    {new Date(booking.startDate).toLocaleDateString()} -{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                    {booking.returnStatus === "Not Returned" && (
                      <span className="block mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 w-max">
                        Late
                      </span>
                    )}
                  </td>
                  <td className="text-sm text-slate-500 p-4">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleRemind(booking._id)}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-blue-200"
                      >
                        <MessageSquare size={14} />
                        Remind
                      </button>
                      <button
                        onClick={() => handleMarkNotReturned(booking._id)}
                        className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-orange-200"
                      >
                        <AlertTriangle size={14} />
                        Not Returned
                      </button>
                      <button
                        onClick={() => handleReportRenter(booking._id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-red-200"
                      >
                        <AlertCircle size={14} />
                        Report Renter
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
