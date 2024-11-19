import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: { street: '', city: '', state: '', postalCode: '', country: '' },
    bio: '',
    company: ''
  });
  const [newProfile, setNewProfile] = useState(profile);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile data
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL+'/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then((response) => {
        const fetchedProfile = response.data;
        setProfile({
          ...fetchedProfile,
          address: fetchedProfile.address || { street: '', city: '', state: '', postalCode: '', country: '' }
        });
        setNewProfile(fetchedProfile);
      })
      .catch((error) => {
        alert('Failed to load profile');
        console.error(error);
      });
  }, []);

  // Handle input changes for profile update
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setNewProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewProfile((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  // Toggle Edit Mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setNewProfile(profile); // Reset form with current profile data
  };

  // Update profile
  const updateProfile = () => {
    axios.put(process.env.REACT_APP_API_URL+'/profile', newProfile, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then((response) => {
        setProfile(response.data);
        alert('Profile updated successfully');
        setIsEditing(false);
      })
      .catch((error) => {
        alert('Failed to update profile');
        console.error(error);
      });
  };

  // Handle password change input
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Change password
  const changePassword = () => {
    axios.put(process.env.REACT_APP_API_URL+'/profile/change-password', passwords, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(() => {
        alert('Password updated successfully');
        setPasswords({ currentPassword: '', newPassword: '' });
      })
      .catch((error) => {
        alert('Failed to change password');
        console.error(error);
      });
  };

  // Delete account
  const deleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      axios.delete(process.env.REACT_APP_API_URL+'/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(() => {
          alert('Account deleted successfully');
          localStorage.removeItem('token');
          window.location.href = '/login';
        })
        .catch((error) => {
          alert('Failed to delete account');
          console.error(error);
        });
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <p className="profile-field"><strong>Name:</strong> {profile.name || 'N/A'}</p>
      <p className="profile-field"><strong>Email:</strong> {profile.email || 'N/A'}</p>
      <p className="profile-field"><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
      <p className="profile-field"><strong>Company:</strong> {profile.company || 'N/A'}</p>
      <p className="profile-field"><strong>Address:</strong> 
        {profile.address?.street || 'N/A'}, {profile.address?.city || 'N/A'}, 
        {profile.address?.state || 'N/A'}, {profile.address?.postalCode || 'N/A'}, 
        {profile.address?.country || 'N/A'}
      </p>
      <p className="profile-field"><strong>Bio:</strong> {profile.bio || 'N/A'}</p>

      {/* Edit Button */}
      {!isEditing && (
        <button onClick={toggleEditMode} className="primary-btn">Update Profile</button>
      )}

      {/* Edit Profile Form */}
      {isEditing && (
        <div className="profile-section">
          <h3>Edit Profile</h3>
          <input type="text" name="name" value={newProfile.name} onChange={handleProfileChange} placeholder="Name" />
          <input type="email" name="email" value={newProfile.email} onChange={handleProfileChange} placeholder="Email" />
          <input type="text" name="phone" value={newProfile.phone} onChange={handleProfileChange} placeholder="Phone" />
          <input type="text" name="company" value={newProfile.company} onChange={handleProfileChange} placeholder="Company" />
          <textarea name="bio" value={newProfile.bio} onChange={handleProfileChange} placeholder="Bio" />
          
          {/* Address Fields */}
          <h4>Address</h4>
          <input type="text" name="street" value={newProfile.address.street} onChange={handleAddressChange} placeholder="Street" />
          <input type="text" name="city" value={newProfile.address.city} onChange={handleAddressChange} placeholder="City" />
          <input type="text" name="state" value={newProfile.address.state} onChange={handleAddressChange} placeholder="State" />
          <input type="text" name="postalCode" value={newProfile.address.postalCode} onChange={handleAddressChange} placeholder="Postal Code" />
          <input type="text" name="country" value={newProfile.address.country} onChange={handleAddressChange} placeholder="Country" />

          <button onClick={updateProfile} className="primary-btn">Save Changes</button>
          <button onClick={toggleEditMode} className="secondary-btn">Cancel</button>
        </div>
      )}

      <div className="profile-section">
        <h3>Change Password</h3>
        <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} placeholder="Current Password" />
        <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} placeholder="New Password" />
        <button onClick={changePassword} className="primary-btn">Change Password</button>
      </div>

      <div className="profile-section">
        <h3>Delete Account</h3>
        <button onClick={deleteAccount} className="danger-btn">Delete Account</button>
      </div>
    </div>
  );
}

export default Profile;
