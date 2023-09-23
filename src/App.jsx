import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [sortedUsers, setSortedUsers] = useState("asc");

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("./users.json");
      if (!response.ok) {
        console.error("Ошибка при загрузке users.json: ", response.statusText);
        return;
      }
      const data = await response.json();
      setUsers(data.users);
    };

    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    setUsers(
      users.map((user) => {
        if (user.id === id) {
          return { ...user, isDeleting: true };
        }
        return user;
      })
    );
  };

  const handleSort = (type) => {
    const sorted = [...users].sort((a, b) => {
      if (a[type] > b[type]) {
        return sortedUsers === "asc" ? 1 : -1;
      }
      if (a[type] < b[type]) {
        return sortedUsers === "asc" ? -1 : 1;
      }
      return 0;
    });
    setSortedUsers(sortedUsers === "asc" ? "desc" : "asc");
    setUsers(sorted);
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "firstName", label: "First Name" },
    { field: "lastName", label: "Last Name" },
    { field: "email", label: "Email" },
    { field: "phone", label: "Phone" },
  ];

  return (
    <>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.field} onClick={() => handleSort(column.field)}>
                {column.label}
              </th>
            ))}
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className={user.isDeleting ? "deleting" : ""}
              onAnimationEnd={() =>
                setUsers(users.filter((u) => u.id !== user.id))
              }
            >
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <button className="del" onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
