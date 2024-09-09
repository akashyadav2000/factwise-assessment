import React, { useState, useEffect, useRef } from 'react';

function UserForm({ user, handleSave, handleCancel }) {
  const [formData, setFormData] = useState(user);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  const textareaRef = useRef(null);

  useEffect(() => {
    const isChanged = JSON.stringify(formData) !== JSON.stringify(user);
    setIsSaveEnabled(isChanged);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [formData, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="user-form">
      <div className="form-row">
        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={calculateAge(formData.dob)}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Transgender">Transgender</option>
            <option value="Rather not say">Rather not say</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Country</label>
          <input type="text" name="country" value={formData.country} onChange={handleChange} />
        </div>
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          ref={textareaRef}
          style={{ resize: 'none', overflow: 'hidden' }}
        />
      </div>
    </div>
  );
}

export default UserForm;
