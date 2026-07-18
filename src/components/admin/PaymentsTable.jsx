import { useEffect, useState } from "react";
import { Search, CreditCard } from "lucide-react";
import { getPayments } from "../../services/adminService";

export default function PaymentsTable() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const res = await getPayments();
      if (res.data.success) {
        setPayments(res.data.payments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = payments.filter(
    (payment) =>
      payment.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      payment.razorpayOrderId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payments</h2>

        <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search payments..."
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
              <th className="p-4 text-left">User</th>
              <th className="text-left">Amount</th>
              <th className="text-left">Order ID</th>
              <th className="text-left">Status</th>
              <th className="text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-500">
                  Loading payments...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-500">
                  No payments found.
                </td>
              </tr>
            ) : (
              filtered.map((payment) => (
                <tr key={payment._id} className="border-b hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <CreditCard size={18} className="text-blue-600" />
                      </div>
                      <span className="font-medium">{payment.user?.name || "Unknown User"}</span>
                    </div>
                  </td>
                  <td className="font-medium text-slate-900">₹{payment.amount}</td>
                  <td className="text-sm font-mono text-slate-600">{payment.razorpayOrderId}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        payment.status === "Success" || payment.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : payment.status === "Failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="text-sm text-slate-500">
                    {new Date(payment.createdAt).toLocaleDateString()}
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
