import { useEffect, useState } from "react";
import { Search, Flag, CheckCircle, Clock } from "lucide-react";
import { getReports, resolveReport } from "../../services/adminService";

export default function ReportsTable() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const res = await getReports();
      if (res.data.success) {
        setReports(res.data.reports);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    if (!window.confirm("Mark this report as resolved?")) return;
    try {
      await resolveReport(id);
      loadReports();
    } catch (err) {
      console.error(err);
      alert("Failed to resolve report");
    }
  };

  const filtered = reports.filter(
    (report) =>
      report.reason?.toLowerCase().includes(search.toLowerCase()) ||
      report.reporter?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reports</h2>

        <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search reports..."
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
              <th className="p-4 text-left">Reporter</th>
              <th className="text-left">Target</th>
              <th className="text-left">Reason</th>
              <th className="text-left">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-500">
                  Loading reports...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-500">
                  No reports found.
                </td>
              </tr>
            ) : (
              filtered.map((report) => (
                <tr key={report._id} className="border-b hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 p-2 rounded-full">
                        <Flag size={18} className="text-red-600" />
                      </div>
                      <span className="font-medium">{report.reporter?.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td>
                    {report.reportedUser ? (
                      <span className="text-sm font-medium">User: {report.reportedUser.name}</span>
                    ) : report.reportedTool ? (
                      <span className="text-sm font-medium">Tool: {report.reportedTool.name}</span>
                    ) : (
                      <span className="text-sm text-slate-400">Unknown Target</span>
                    )}
                  </td>
                  <td className="max-w-xs truncate" title={report.description}>
                    <div className="font-medium">{report.reason}</div>
                    <div className="text-xs text-slate-500 truncate">{report.description}</div>
                  </td>
                  <td>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                        report.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {report.status === "Resolved" ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-center">
                      {report.status !== "Resolved" ? (
                        <button
                          onClick={() => handleResolve(report._id)}
                          className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="text-sm text-slate-400">Done</span>
                      )}
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
