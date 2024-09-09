import React, { useState } from 'react';
import Search from './Search';
import UserAccordion from './UserAccordion';

const UserList = ({ users, onDelete, onUpdate }) => {
  const [query, setQuery] = useState('');
  const [isAnyEditMode, setIsAnyEditMode] = useState(false); // Track if any accordion is in edit mode
  const [openAccordionId, setOpenAccordionId] = useState(null); // Track which accordion is open

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    `${user.first} ${user.last}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleUpdate = (updatedUser) => {
    onUpdate(updatedUser);
    setIsAnyEditMode(false); // Exit edit mode after updating
  };

  const toggleAccordion = (id) => {
    // Toggle the accordion, collapse others by setting their ID to null
    if (!isAnyEditMode) {
      setOpenAccordionId((prevId) => (prevId === id ? null : id));
    }
  };

  return (
    <>
      <div>
        <Search query={query} setQuery={setQuery} />
        {filteredUsers.map(user => (
          <UserAccordion
            key={user.id}
            user={user}
            onDelete={onDelete}
            onUpdate={handleUpdate}
            isAnyEditMode={isAnyEditMode}
            setIsAnyEditMode={setIsAnyEditMode}
            isOpen={openAccordionId === user.id} // Pass if the accordion is open
            toggleAccordion={() => toggleAccordion(user.id)} // Pass toggle function
          />
        ))}
      </div>
    </>
  );
};

export default UserList;
