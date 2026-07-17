import { useEffect, useState } from "react";
import { Search, ShieldCheck, ShieldX, Trash2 } from "lucide-react";
import {
  getUsers,
  blockUser,
  deleteUser,
} from "../../services/adminService";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleBlock = async (id) => {
    await blockUser(id);
    loadUsers();
  };

  const removeUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await deleteUser(id);
    loadUsers();
  };

  const filtered = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users</h2>

        <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search users..."
            className="ml-2 bg-transparent outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="text-left">Email</th>
              <th className="text-left">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((user) => (
              <tr
                key={user._id}
                className="border-b hover:bg-slate-50 transition"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>

                    <span>{user.name}</span>
                  </div>
                </td>

                <td>{user.email}</td>

                <td>
                  {user.isBlocked ? (
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                      Blocked
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                      Active
                    </span>
                  )}
                </td>

                <td>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => toggleBlock(user._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg"
                    >
                      {user.isBlocked ? (
                        <ShieldCheck size={18} />
                      ) : (
                        <ShieldX size={18} />
                      )}
                    </button>

                    <button
                      onClick={() => removeUser(user._id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-8 text-slate-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}