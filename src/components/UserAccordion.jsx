import React, { useState, useEffect, useRef } from 'react';
import { FaTrashAlt, FaPencilAlt, FaChevronDown, FaChevronUp, FaTimes, FaCheck, FaTimesCircle } from 'react-icons/fa';

// Utility function to calculate age from date of birth
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const UserAccordion = ({ user, onDelete, onUpdate, isAnyEditMode, setIsAnyEditMode, isOpen, toggleAccordion }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({
    fullName: `${user.first} ${user.last}`,
    gender: user.gender,
    country: user.country,
    description: user.description,
    age: calculateAge(user.dob),
  });
  const [originalUser, setOriginalUser] = useState(editedUser); // To store the last known state
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // For delete confirmation modal

  const [isAgeError, setIsAgeError] = useState(false); // New state for age validation error

  const spanRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [editedUser.description, isEditMode]);

  useEffect(() => {
    setIsSaveEnabled(
      editedUser.fullName !== originalUser.fullName ||
      editedUser.gender !== originalUser.gender ||
      editedUser.country !== originalUser.country ||
      editedUser.description !== originalUser.description ||
      editedUser.age !== originalUser.age
    );
  }, [editedUser, originalUser]);

  const handleEdit = () => {
    if (editedUser.age >= 18) {
      setIsEditMode(true);
      setIsAnyEditMode(true); // Set global edit mode to true
      setIsAgeError(false); // Reset age error when entering edit mode
    } else {
      setIsAgeError(true); // Set age error when age is less than 18
    }
  };

  const handleCancel = () => {
    setEditedUser(originalUser);
    setIsEditMode(false);
    setIsAnyEditMode(false); // Exit global edit mode
    setIsAgeError(false); // Reset age error on cancel
  };

  const handleSave = () => {
    if (!isSaveEnabled) return;

    const [first, ...rest] = editedUser.fullName.trim().split(' ');
    const last = rest.join(' ');
    onUpdate({
      ...user,
      first: first.trim(),
      last: last.trim(),
      gender: editedUser.gender,
      country: editedUser.country,
      description: editedUser.description.trim(),
      dob: new Date().setFullYear(new Date().getFullYear() - editedUser.age), // Calculate date of birth from age
    });
    setOriginalUser(editedUser); // Update original state after save
    setIsEditMode(false);
    setIsAnyEditMode(false); // Exit global edit mode after saving
    setIsAgeError(false); // Reset age error after saving
  };

  const handleInputChange = (field, value) => {
    if (field === 'country' && /\d/.test(value)) return; // Prevent numbers in country
    if (field === 'fullName' && value.length > 20) return; // Prevent more than 20 characters in fullName
    if (field === 'fullName' && !/^[a-zA-Z\s]*$/.test(value)) return; // Prevent numbers and symbols in fullName
    if (field === 'age' && (!/^\d*$/.test(value) || value.length > 2)) return; // Prevent non-numeric characters and max length of 3 for age

    setEditedUser((prev) => ({ ...prev, [field]: value }));

    if (field === 'fullName' && spanRef.current) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const startOffset = range.startOffset;

      setTimeout(() => {
        const newRange = document.createRange();
        newRange.setStart(spanRef.current.childNodes[0], startOffset);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }, 0);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true); // Open delete confirmation modal
  };

  const handleDeleteConfirm = () => {
    onDelete(user.id);
    setIsDeleteModalOpen(false); // Close the modal after deletion
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false); // Close the modal without deleting
  };

  const isFieldEmpty = Object.values(editedUser).some((value) => {
    return typeof value === 'string' && value.trim() === '';
  });

  return (
    <div className={`accordion-item ${isOpen ? 'expanded' : ''}`}>
      <div className="accordion-header" onClick={toggleAccordion}>
        <img src={user.picture} alt={`${editedUser.fullName}`} />
        {isEditMode ? (
          <span
            ref={spanRef}
            contentEditable
            suppressContentEditableWarning={true}
            className="editable-span"
            onInput={(e) => handleInputChange('fullName', e.currentTarget.textContent)}
            style={{ padding: '4px', border: '1px solid #a1a1a1', borderRadius: '10px', minWidth: '50px' }}
          >
            {editedUser.fullName}
          </span>
        ) : (
          <span className="user_name">{`${user.first} ${user.last}`}</span>
        )}
        <button className="button">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {isOpen && (
        <div className="accordion-content">
          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              {isEditMode ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <input
                    type="text"
                    value={editedUser.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    maxLength={3}
                    style={{ width: '100%', marginRight: '1px' }} // Decrease width of input and adjust padding
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: '55px', // Position "Years" label inside the input
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none', // Make it uneditable
                    }}
                  >
                    Years
                  </span>
                </div>
              ) : (
                <p>{`${editedUser.age} Years`}</p>
              )}
            </div>

            <div className="form-group">
              <label>Gender</label>
              {isEditMode ? (
                <select
                  value={editedUser.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                  <option value="Rather not say">Rather not say</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p>{user.gender}</p>
              )}
            </div>

            <div className="form-group">
              <label>Country</label>
              {isEditMode ? (
                <input
                  type="text"
                  value={editedUser.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                />
              ) : (
                <p>{user.country}</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            {isEditMode ? (
              <textarea
                value={editedUser.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                ref={textareaRef}
              />
            ) : (
              <p>{user.description}</p>
            )}
          </div>

          {/* Age validation message */}
          {isAgeError && (
            <p style={{ color: 'red', fontSize: '14px', marginTop: '10px' }}>
              Person must be at least 18 years old to edit.
            </p>
          )}


          <div className="button-group">
            {isEditMode ? (
              <div className="form-actions">
                <button onClick={handleCancel}>
                  <FaTimes style={{ color: 'red', border: '1px solid red', padding: '4px', fontSize: '26px', borderRadius: '50%' }} />
                </button>
                <button onClick={handleSave} disabled={!isSaveEnabled || isFieldEmpty}>
                  <FaCheck style={{ color: 'green', border: '1px solid green', padding: '4px', fontSize: '26px', borderRadius: '50%' }} />
                </button>
              </div>
            ) : (
              <div className="form-actions">
                <button onClick={handleEdit} disabled={isAnyEditMode}>
                  <FaPencilAlt style={{
                    color: 'blue', border: '1px solid blue', padding: '4px 0', height: '27px',
                    width: '27px', borderRadius: '50%'
                  }} />
                </button>
                <button onClick={handleDeleteClick}>
                  <FaTrashAlt style={{
                    color: 'red', border: '1px solid red', padding: '4px 0', height: '27px',
                    width: '27px', borderRadius: '50%'
                  }} />
                </button>
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && (
            <div className="delete-modal">
              <div className="modal-content">
                <button className="modal-close" onClick={handleDeleteCancel} style={{ position: 'absolute', top: '10px', right: '10px', border: 'none', background: 'transparent' }}>
                  <FaTimes style={{ color: 'gray', fontSize: '24px' }} />
                </button>
                <p>Are you sure you want to delete this user?</p>
                <div className="modal-actions">
                  <button
                    className="modal-cancel"
                    onClick={handleDeleteCancel}
                    style={{
                      backgroundColor: 'transparent', color: 'black', border: '1px solid black', padding: '8px 22px',
                      borderRadius: '10px', marginRight: '10px'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="modal-delete"
                    onClick={handleDeleteConfirm}
                    style={{
                      backgroundColor: 'red', color: 'white', border: '1px solid red', padding: '8px 22px',
                      borderRadius: '10px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )
      }
    </div >
  );
};

export default UserAccordion;
