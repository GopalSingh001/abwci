import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function PageImagesManagement() {
  const [pageImages, setPageImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    is_active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Page labels and dimension specifications
  const pageLabels = {
    'about-us': 'About Us',
    'partnerships': 'Partnerships',
    'support': 'Support',
    'mentorship': 'Mentorship',
    'blog': 'Blog',
    'resources': 'Resources',
    'login': 'Login Page',
    'verify-otp': 'Verify OTP Page',
    'forgot-password': 'Forgot Password Page',
    'verify-code': 'Verify Code Page',
    'reset-password': 'Reset Password Page',
    'impact-hero': 'Impact Page - Hero (Top)',
    'impact-hero-bottom': 'Impact Page - Hero Bottom (Stats Section)',
    'impact-cta': 'Impact Page - CTA Section (Women in Field)',
    'knowledge-hub-hero': 'Knowledge Hub - Hero (Top)',
    'knowledge-hub-cta': 'Knowledge Hub - CTA Section (Email Subscription)',
    'mentorship-hero': 'Mentorship Page - Hero (Top)',
    // Navbar dropdown images
    'nav-about-us': 'Navbar - About Us Dropdown Image',
    'nav-opportunities': 'Navbar - Opportunities Dropdown Image',
    'nav-impact': 'Navbar - Our Impact Dropdown Image',
    'nav-leadership': 'Navbar - Leadership Dropdown Image',
    'nav-support': 'Navbar - Support Dropdown Image'
  };

  // Recommended dimensions for each page
  const pageDimensions = {
    'about-us': {
      recommended: '1920 × 256px (Desktop) / 1920 × 162px (Mobile)',
      aspectRatio: '16:9 or 7.5:1',
      description: 'Hero banner - Desktop: 256px height, Mobile: 162px height'
    },
    'partnerships': {
      recommended: '800 × 1000px (or similar portrait/square)',
      aspectRatio: '4:5 or 1:1',
      description: 'Side image displayed next to text content - portrait/square format works best'
    },
    'support': {
      recommended: '1920 × 340px (Desktop) / 1920 × 400px (Mobile)',
      aspectRatio: '16:3 or 4.8:1',
      description: 'Hero banner - Desktop: 340px height, Mobile: 400px height'
    },
    'mentorship': {
      recommended: '1920 × 643px (Desktop) / 1920 × 400px (Mobile)',
      aspectRatio: '3:1 (Desktop) / 4.8:1 (Mobile)',
      description: 'Middle section banner - Desktop: 643px height, Mobile: 400px height. Image fills full width container.'
    },
    'blog': {
      recommended: '1920 × 500px (or taller to show full image)',
      aspectRatio: '3.84:1 or taller',
      description: 'Hero banner section at the top of the blog page. Image will be displayed at full size without cropping - ensure important content is in the top portion.'
    },
    'resources': {
      recommended: '1920 × 459px',
      aspectRatio: '4.18:1',
      description: 'Hero banner section at the top of the resources page with yellow gradient overlay'
    },
    'login': {
      recommended: '1920 × 1080px',
      aspectRatio: '16:9',
      description: 'Full background image'
    },
    'verify-otp': {
      recommended: '1920 × 1080px',
      aspectRatio: '16:9',
      description: 'Full background image'
    },
    'forgot-password': {
      recommended: '1920 × 1080px',
      aspectRatio: '16:9',
      description: 'Full background image'
    },
    'verify-code': {
      recommended: '1920 × 1080px',
      aspectRatio: '16:9',
      description: 'Full background image'
    },
    'reset-password': {
      recommended: '1920 × 1080px',
      aspectRatio: '16:9',
      description: 'Full background image'
    },
    'impact-hero': {
      recommended: '1920 × 1080px',
      aspectRatio: '16:9',
      description: 'Hero banner - Top section'
    },
    'impact-hero-bottom': {
      recommended: '1920 × 400px',
      aspectRatio: '4.8:1',
      description: 'Stats section banner'
    },
    'impact-cta': {
      recommended: '1920 × 600px',
      aspectRatio: '16:5',
      description: 'CTA section banner'
    },
    'knowledge-hub-hero': {
      recommended: '1920 × 1080px',
      aspectRatio: '16:9',
      description: 'Hero banner - Top section with gradient overlay (650px height, full image display)'
    },
    'knowledge-hub-cta': {
      recommended: '1920 × 900px',
      aspectRatio: '2.13:1',
      description: 'CTA section banner - Email subscription section (just above footer)'
    },
    'mentorship-hero': {
      recommended: '1920 × 643px (Desktop) / 1920 × 500px (Mobile)',
      aspectRatio: '3:1 (Desktop) / 3.84:1 (Mobile)',
      description: 'Hero banner section at the top of the mentorship page - Desktop: 643px height, Mobile: 500px height. Full background image with content overlay.'
    },
    // Navbar dropdown images (used in expanded panels)
    'nav-about-us': {
      recommended: '1200 × 600px',
      aspectRatio: '2:1',
      description: 'Image shown in the About Us dropdown panel in the top navbar (desktop). Use a wide landscape image with important content centered.'
    },
    'nav-opportunities': {
      recommended: '1200 × 600px',
      aspectRatio: '2:1',
      description: 'Image shown in the Opportunities dropdown panel in the top navbar (desktop). Use a wide landscape image that works well behind text.'
    },
    'nav-impact': {
      recommended: '1200 × 600px',
      aspectRatio: '2:1',
      description: 'Image shown in the Our Impact dropdown panel in the top navbar (desktop). Use a wide landscape image with key focus near the center.'
    },
    'nav-leadership': {
      recommended: '1200 × 600px',
      aspectRatio: '2:1',
      description: 'Image shown in the Leadership dropdown panel in the top navbar (desktop). Use a wide landscape image with people/leadership focus framed centrally.'
    },
    'nav-support': {
      recommended: '1200 × 600px',
      aspectRatio: '2:1',
      description: 'Image shown in the Support dropdown panel in the top navbar (desktop). Use a wide landscape image with important content centered. Falls back to the Support page hero image if not set.'
    }
  };

  useEffect(() => {
    fetchPageImages();
  }, []);

  const fetchPageImages = async () => {
    const token = localStorage.getItem('token');  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/page-images`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPageImages(data.data || []);
      } else {
        console.error('Failed to fetch page images:', response.status);
      }
    } catch (error) {
      console.error('Error fetching page images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      title: image.title || '',
      is_active: image.is_active
    });
    setImagePreview(image.image_url || null);
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
    
    if (imageFile) {
      submitData.append('image', imageFile);
    }
    // Only upload when a file is selected; avoid persisting defaults directly

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/page-images/${editingImage.page_name}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      if (response.ok) {
        alert('Page image updated successfully!');
        setShowModal(false);
        resetForm();
        fetchPageImages();
      } else {
        let message = `Request failed (${response.status})`;
        try {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const error = await response.json();
            message = error.message || error.error || message;
          } else {
            const text = await response.text();
            if (response.status === 413 || /Request Entity Too Large/i.test(text)) {
              message = 'File too large. Max allowed size is 10MB.';
            } else {
              message = text || message;
            }
          }
        } catch (_) {
          if (response.status === 413) message = 'File too large. Max allowed size is 10MB.';
        }
        alert(`Error: ${message}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save page image');
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxBytes = 10 * 1024 * 1024;
      if (file.size > maxBytes) {
        alert('Selected file is too large. Max allowed size is 10MB.');
        e.target.value = '';
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      is_active: true
    });
    setEditingImage(null);
    setImageFile(null);
    setImagePreview(null);
    setUploading(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading page images...</p>
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
              <h1 className="text-3xl font-bold text-gray-800">Page Images Management</h1>
              <p className="text-gray-600 mt-1">Manage hero/banner images for About Us, Partnerships, Support, Mentorship, Knowledge Hub, Impact, Blog, and Resources pages</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-8">
        {(() => {
          const allPages = Object.keys(pageLabels);
          const mergedList = allPages.map((key) => pageImages.find(p => p.page_name === key) || {
            id: `virtual-${key}`,
            page_name: key,
            title: pageLabels[key],
            image_url: '',
            is_active: true,
            _isVirtual: true
          });
          return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mergedList.map((image) => (
            <div key={image.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                {image.image_url ? (
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', image.image_url);
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                    No image set
                  </div>
                )}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                  image.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {image.is_active ? 'Active' : 'Inactive'}
                </div>
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white">
                  {pageLabels[image.page_name] || image.page_name}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 truncate">{image.title}</h3>
                <p className="text-sm text-gray-500 mb-1">Page: {image.page_name}</p>
                {pageDimensions[image.page_name] && (
                  <div className="mb-3 p-2 bg-blue-50 rounded-md border border-blue-200">
                    <p className="text-xs font-semibold text-blue-900 mb-1">Recommended Dimensions:</p>
                    <p className="text-xs text-blue-700">{pageDimensions[image.page_name].recommended}</p>
                    <p className="text-xs text-blue-600 mt-1">{pageDimensions[image.page_name].description}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(image)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {image._isVirtual ? 'Add' : 'Edit'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
          );
        })()}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit {pageLabels[editingImage?.page_name]} Image
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
                      placeholder="Enter image title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Page
                    </label>
                    <input
                      type="text"
                      disabled
                      value={pageLabels[editingImage?.page_name]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
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
                      Image (Optional - leave empty to keep current)
                    </label>
                    {pageDimensions[editingImage?.page_name] && (
                      <div className="mb-3 p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                        <div className="flex items-start gap-2 mb-2">
                          <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-purple-900 mb-1">Recommended Dimensions:</p>
                            <p className="text-sm font-semibold text-purple-800 mb-1">{pageDimensions[editingImage.page_name].recommended}</p>
                            <p className="text-xs text-purple-700 mb-1">Aspect Ratio: {pageDimensions[editingImage.page_name].aspectRatio}</p>
                            <p className="text-xs text-purple-600">{pageDimensions[editingImage.page_name].description}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*,.svg"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: JPEG, PNG, GIF, WebP, SVG, BMP, TIFF, ICO, AVIF (Max 10MB)
                    </p>
                    {imageFile && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                        <p className="text-xs text-yellow-800">
                          <strong>Selected:</strong> {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      </div>
                    )}
                    {imagePreview && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Image Preview:</p>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        {imageFile && (
                          <div className="mt-2 text-xs text-gray-600">
                            <p>Tip: Ensure the image matches the recommended dimensions for best display quality.</p>
                          </div>
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
                        <span>{imageFile ? 'Uploading...' : 'Updating...'}</span>
                      </>
                    ) : (
                      <span>Update Image</span>
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

