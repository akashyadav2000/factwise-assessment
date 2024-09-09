import React, { useState } from 'react';
import data from './assets/celebrities.json';
import UserList from './components/UserList';

function App() {
  const [users, setUsers] = useState(data);

  const updateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
    );
  };


  const deleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="app-container">
      <UserList users={users} onDelete={deleteUser} onUpdate={updateUser} />
    </div>
  );
}

export default App;
