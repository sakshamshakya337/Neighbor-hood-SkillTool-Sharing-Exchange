import { useEffect, useState } from "react";
import { Search, Wrench, CircleCheck } from "lucide-react";
import { getTools } from "../../services/adminService";

export default function ToolsTable() {
  const [tools, setTools] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const res = await getTools();

      if (res.data.success) {
        setTools(res.data.tools);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = tools.filter(
    (tool) =>
      tool.name?.toLowerCase().includes(search.toLowerCase()) ||
      tool.owner?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tools</h2>

        <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search tools..."
            className="ml-2 bg-transparent outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-4 text-left">Tool</th>
              <th className="text-left">Owner</th>
              <th className="text-left">Price/Day</th>
              <th className="text-left">Condition</th>
              <th className="text-left">Availability</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((tool) => (
              <tr
                key={tool._id}
                className="border-b hover:bg-slate-50 transition"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Wrench size={18} className="text-blue-600" />
                    </div>

                    <span className="font-medium">
                      {tool.name}
                    </span>
                  </div>
                </td>

                <td>{tool.owner?.name}</td>

                <td>₹{tool.pricePerDay}</td>

                <td>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm">
                    {tool.condition}
                  </span>
                </td>

                <td>
                  {tool.available ? (
                    <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      <CircleCheck size={16} />
                      Available
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                      Not Available
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8 text-slate-500"
                >
                  No tools found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}