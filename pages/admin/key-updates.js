import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function KeyUpdatesManagement() {
  const [keyUpdates, setKeyUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    display_order: 0,
    is_active: true
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchKeyUpdates();
  }, []);

  const fetchKeyUpdates = async () => {
    const token = localStorage.getItem('token');  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/key-updates/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched key updates:', data.data);
        setKeyUpdates(data.data || []);
      } else {
        console.error('Failed to fetch key updates:', response.status);
      }
    } catch (error) {
      console.error('Error fetching key updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (update) => {
    setEditingUpdate(update);
    setFormData({
      title: update.title || '',
      display_order: update.display_order || 0,
      is_active: update.is_active
    });
    setMediaPreview(update.image_url || null);
    setMediaType(update.media_type || 'image');
    setMediaFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const token = localStorage.getItem('token');
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    if (mediaFile) {
      submitData.append('media', mediaFile);
    }

    try {
      const url = editingUpdate
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/key-updates/${editingUpdate.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/key-updates`;

      const response = await fetch(url, {
        method: editingUpdate ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      if (response.ok) {
        alert(editingUpdate ? 'Key update updated successfully!' : 'Key update created successfully!');
        setShowModal(false);
        resetForm();
        fetchKeyUpdates();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save key update');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this key update?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/key-updates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Key update deleted successfully!');
        fetchKeyUpdates();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete key update');
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      const isVideo = file.type.startsWith('video/');
      setMediaType(isVideo ? 'video' : 'image');
      
      if (isVideo) {
        // For videos, create object URL for preview
        const videoUrl = URL.createObjectURL(file);
        setMediaPreview(videoUrl);
      } else {
        // For images, use FileReader
        const reader = new FileReader();
        reader.onload = (e) => setMediaPreview(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      display_order: 0,
      is_active: true
    });
    setEditingUpdate(null);
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    setUploading(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading key updates...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Key Updates Management</h1>
              <p className="text-gray-600 mt-1">Manage homepage key update images</p>
            </div>
            <button
              onClick={() => {
                setEditingUpdate(null);
                resetForm();
                setShowModal(true);
              }}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Key Update
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-8">
        {keyUpdates.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Key Updates Yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first key update image.</p>
            <button
              onClick={() => {
                setEditingUpdate(null);
                resetForm();
                setShowModal(true);
              }}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Add First Key Update
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyUpdates.map((update) => {
              const isVideo = update.media_type === 'video';
              console.log('Rendering update:', {
                id: update.id,
                title: update.title,
                media_type: update.media_type,
                image_url: update.image_url,
                isVideo: isVideo
              });
              return (
              <div key={update.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  {isVideo ? (
                    <video
                      src={update.image_url}
                      className="w-full h-48 object-cover"
                      muted
                      loop
                      playsInline
                      controls
                      onError={(e) => {
                        console.error('Video failed to load:', update.image_url);
                        console.error('Update object:', update);
                        e.target.style.display = 'none';
                      }}
                      onLoadStart={() => {
                        console.log('Video loading started:', update.image_url);
                      }}
                    />
                  ) : (
                    <img
                      src={update.image_url}
                      alt={update.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        console.error('Image failed to load:', update.image_url);
                        console.error('Error details:', e);
                        console.error('Image element:', e.target);
                        
                        // Try direct S3 URL without signed parameters
                        const directUrl = update.image_url.split('?')[0];
                        console.log('Trying direct URL:', directUrl);
                        
                        // Try to load the image directly to test
                        const testImg = new Image();
                        testImg.onload = () => {
                          console.log('Direct image load successful');
                          e.target.src = directUrl;
                        };
                        testImg.onerror = () => {
                          console.log('Direct image load failed');
                          e.target.style.display = 'none';
                        };
                        testImg.src = directUrl;
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', update.image_url);
                      }}
                    />
                  )}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                    update.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {update.is_active ? 'Active' : 'Inactive'}
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Order: {update.display_order}
                    </div>
                    {update.media_type === 'video' && (
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Video
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 truncate">{update.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(update)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(update.id)}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingUpdate ? 'Edit Key Update' : 'Add New Key Update'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="Enter key update title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="Display order (lower numbers appear first)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    >
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Media (Image or Video) {!editingUpdate && '*'}
                    </label>
                    <input
                      type="file"
                      accept="image/*,.svg,video/*"
                      onChange={handleMediaChange}
                      required={!editingUpdate}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: Images (JPEG, PNG, GIF, WebP, SVG, BMP, TIFF, ICO, AVIF) or Videos (MP4, WebM, OGG, MOV, AVI, WMV, FLV, MKV) (Max 100MB)
                    </p>
                    {mediaPreview && (
                      <div className="mt-4">
                        {mediaType === 'video' ? (
                          <video
                            src={mediaPreview}
                            controls
                            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                          />
                        ) : (
                          <img
                            src={mediaPreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={uploading}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{mediaFile ? 'Uploading...' : 'Updating...'}</span>
                      </>
                    ) : (
                      <span>{editingUpdate ? 'Update Key Update' : 'Create Key Update'}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}