import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/AdminLayout';

export default function UsersByTypeManagement() {
  const router = useRouter();
  const { type } = router.query;
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    // User fields
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    status: 'active',
    // Member fields (complete details)
    middle_name: '',
    phone: '',
    country_code: '',
    company_name: '',
    position: '',
    sector: '',
    country: '',
    website: '',
    company_address: '',
    regd_number: '',
    regd_number_type: '',
    ownership: '',
    region: '',
    total_employees: '',
    member_type: '',
    profile_image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const typeLabels = {
    'Mentor': 'Mentors',
    'Mentee': 'Mentees',
    'Member': 'Members'
  };

  useEffect(() => {
    if (type) {
      fetchUsers();
    }
  }, [type]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const allUsers = data.data || [];
        
        // Remove duplicates based on user ID (keep the first occurrence)
        const uniqueUsers = [];
        const seenIds = new Set();
        allUsers.forEach(user => {
          if (!seenIds.has(user.id)) {
            seenIds.add(user.id);
            uniqueUsers.push(user);
          }
        });
        
        // Debug: Log all unique member_type values
        const uniqueTypes = [...new Set(uniqueUsers.map(u => u.member_type).filter(Boolean))];
        
        // Filter users by member_type
        let filteredUsers = uniqueUsers.map(user => {
          // Set default member_type to "Members" for pending users without defined role
          if (user.status === 'pending' && !user.member_type) {
            return { ...user, member_type: 'Members' };
          }
          return user;
        });

        // Filter by the selected type
        if (type && type !== 'all') {
          if (type === 'Member') {
            // For Member: show ALL users that are NOT mentee or mentor
            // This includes: null, empty, "Member", "member", "Members", "members", and any other invalid types
            filteredUsers = filteredUsers.filter(user => {
              const userType = user.member_type;
              
              // If no member_type, include (default to Member)
              if (!userType || userType === '' || userType === null || userType === undefined) {
                return true; // Include all users without member_type
              }
              
              const normalizedUserType = userType.toString().trim().toLowerCase();
              
              // Exclude ONLY mentee and mentor variations
              const isMentee = ['mentee', 'mentees'].includes(normalizedUserType);
              const isMentor = ['mentor', 'mentors'].includes(normalizedUserType);
              
              // Include everything that is NOT mentee and NOT mentor
              // This includes: "Member", "member", "Business Association", "C1", null, etc.
              return !isMentee && !isMentor;
            });
            
          } else {
            // For Mentor and Mentee: use exact matching
            const typeMapping = {
              'Mentor': ['mentors', 'mentor', 'Mentors', 'Mentor'],
              'Mentee': ['mentees', 'mentee', 'Mentees', 'Mentee']
            };
            
            const validVariations = typeMapping[type] || [type.toLowerCase(), type];
            
            filteredUsers = filteredUsers.filter(user => {
              // Get user's member_type, with fallback for pending users
              let userType = user.member_type;
              if (!userType && user.status === 'pending') {
                userType = 'Member';
              }
              
              // Normalize the user's member_type
              const normalizedUserType = (userType || '').toString().trim().toLowerCase();
              
              // Check if it matches any valid variation
              const matches = validVariations.some(variation => 
                normalizedUserType === variation.toLowerCase()
              );
              
              return matches;
            });
          }
        }


        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    // Set default member_type to "Member" for pending users without defined role
    const finalMemberType = formData.member_type || (formData.status === 'pending' ? 'Member' : '');
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'member_type') {
        // Use the final member_type (with default for pending)
        if (finalMemberType) {
          submitData.append(key, finalMemberType);
        }
      } else if (formData[key]) {
        submitData.append(key, formData[key]);
      }
    });
    
    if (imageFile) {
      submitData.append('profile_image', imageFile);
    }

    try {
      // Update user only
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      if (userResponse.ok) {
        alert('User updated successfully!');
        setShowModal(false);
        resetForm();
        fetchUsers();
      } else {
        const error = await userResponse.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    
    setFormData({
      // User fields
      username: user.username || '',
      email: user.email || '',
      first_name: user.member_first_name || user.first_name || '',
      last_name: user.member_last_name || user.last_name || '',
      status: user.status || 'active',
      // Member fields (complete details) - now populated from API
      middle_name: user.middle_name || '',
      phone: user.phone || '',
      country_code: user.country_code || '',
      company_name: user.company_name || '',
      position: user.position || '',
      sector: user.sector || '',
      country: user.country || '',
      website: user.website || '',
      company_address: user.company_address || '',
      regd_number: user.regd_number || '',
      regd_number_type: user.regd_number_type || '',
      ownership: user.ownership || '',
      region: user.region || '',
      total_employees: user.total_employees || '',
      // Set default to "Member" if pending and no member_type defined
      member_type: user.member_type || (user.status === 'pending' ? 'Member' : ''),
      profile_image: user.profile_image || ''
    });
    setImagePreview(user.profile_image_url || null);
    setShowModal(true);
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchUsers();
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Status update error:', error);
      alert('Failed to update status');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      status: 'active',
      middle_name: '',
      phone: '',
      country_code: '',
      company_name: '',
      position: '',
      sector: '',
      country: '',
      website: '',
      company_address: '',
      regd_number: '',
      regd_number_type: '',
      ownership: '',
      region: '',
      total_employees: '',
      member_type: '',
      profile_image: ''
    });
    setEditingUser(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const filteredUsers = users.filter(user => {
    // If search term is empty, show all users
    if (!searchTerm || searchTerm.trim() === '') {
      return true;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const firstName = (user.first_name || user.member_first_name || '').toLowerCase();
    const lastName = (user.last_name || user.member_last_name || '').toLowerCase();
    const username = (user.username || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    
    return firstName.includes(searchLower) ||
           lastName.includes(searchLower) ||
           username.includes(searchLower) ||
           email.includes(searchLower);
  });

  const getStatusBadgeColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || colors.active;
  };


  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {typeLabels[type] || 'Users'} Management
            </h1>
            <p className="text-gray-600">Manage {typeLabels[type]?.toLowerCase() || 'user'} accounts and profiles</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder={`Search ${typeLabels[type]?.toLowerCase() || 'users'} by name, username, or email...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email & Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registered
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {user.profile_image_url ? (
                                <img
                                  src={user.profile_image_url}
                                  alt={user.username}
                                  className="h-10 w-10 rounded-full object-cover border-2 border-purple-200"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                  <span className="text-purple-600 font-medium">
                                    {(user.username || user.email || user.member_first_name || user.first_name || 'U')?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {/* Show member name if available, otherwise user name, otherwise username, otherwise email, otherwise ID */}
                                {(user.member_first_name || user.member_last_name) ? 
                                  `${user.member_first_name || ''} ${user.middle_name || ''} ${user.member_last_name || ''}`.trim() : 
                                  (user.first_name || user.last_name) ?
                                    `${user.first_name || ''} ${user.last_name || ''}`.trim() :
                                    user.username || user.email || `User ${user.id}`}
                              </div>
                              {user.company_name && (
                                <div className="text-xs text-gray-400">🏢 {user.company_name}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{user.email || '-'}</div>
                          {user.email_verified_at && (
                            <div className="text-xs text-green-600">✓ Verified</div>
                          )}
                          {user.phone && (
                            <div className="text-xs text-gray-500">📱 {user.phone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {user.member_type || (user.status === 'pending' ? 'Member' : 'Member')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={user.status || 'pending'}
                            onChange={(e) => handleStatusUpdate(user.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full border-0 font-semibold ${getStatusBadgeColor(user.status || 'pending')}`}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                            <option value="pending">Pending</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {user.registered_at ? new Date(user.registered_at).toLocaleDateString() : 
                           user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-2">No {typeLabels[type]?.toLowerCase() || 'users'} found</p>
                <p className="text-sm text-gray-400">
                  {type ? `No users with member type "${type}" found. Check browser console for details.` : 'No users found.'}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Tip: Make sure users have their member_type set correctly in the database.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Edit Modal with Complete Member Details */}
        {showModal && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* User Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">User Information</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Member Type (Joining As)
                    </label>
                    <select
                      value={formData.member_type}
                      onChange={(e) => setFormData({ ...formData, member_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                    >
                      <option value="">Select member type</option>
                      <option value="Mentor">Mentor</option>
                      <option value="Mentee">Mentee</option>
                      <option value="Member">Member</option>
                    </select>
                  </div>

                  {/* Member Details */}
                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Member Details</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      value={formData.middle_name}
                      onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Position
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Sector
                    </label>
                    <input
                      type="text"
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Company Address
                    </label>
                    <textarea
                      value={formData.company_address}
                      onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white text-sm"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img src={imagePreview} alt="Preview" className="h-20 w-20 rounded-full object-cover border-2 border-purple-200" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

