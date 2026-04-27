import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';

export default function PostsManagement() {
  const router = useRouter();
  const { type } = router.query;
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    post_title: '',
    post_short_desc: '',
    post_desc: '',
    post_page: '',
    post_category: '',
    post_designation: '',
    post_company: '',
    post_country: '',
    post_more_link: '',
    post_register_link: '',
    post_thumbnail: '',
    post_banner: '',
    post_status: 'active',
    post_priority: 0
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [priorityConflict, setPriorityConflict] = useState(null);
  const [suggestedPriority, setSuggestedPriority] = useState(null);
  const loadMoreRef = useRef(null);

  const typeLabels = {
    blogs: 'Blogs',
    resources: 'Resources',
    stories: 'Success Stories',
    partners: 'Partnerships',
    tenders: 'Tenders',
    opportunities: 'Opportunities'
  };

  useEffect(() => {
    if (type) {
      setPosts([]);
      setOffset(0);
      setHasMore(true);
      fetchPosts(true);
    }
  }, [type]);

  // Check for priority conflicts when priority changes
  useEffect(() => {
    if (formData.post_priority > 0 && type) {
      // Check if this priority already exists for another post of the same type
      const conflictingPost = posts.find(post => 
        post.post_priority === formData.post_priority && 
        (!editingItem || post.id !== editingItem.id)
      );
      
      if (conflictingPost) {
        setPriorityConflict({
          message: `Priority ${formData.post_priority} is already assigned to "${conflictingPost.post_title}"`,
          conflictingPost: conflictingPost.post_title
        });
        
        // Calculate next available priority
        const priorities = posts
          .filter(p => !editingItem || p.id !== editingItem.id)
          .map(p => p.post_priority || 0)
          .filter(p => p > 0);
        const maxPriority = priorities.length > 0 ? Math.max(...priorities) : 0;
        setSuggestedPriority(maxPriority + 1);
      } else {
        setPriorityConflict(null);
        setSuggestedPriority(null);
      }
    } else {
      setPriorityConflict(null);
      setSuggestedPriority(null);
    }
  }, [formData.post_priority, posts, type, editingItem]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          console.log('📜 Reached bottom, loading more...');
          fetchPosts(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loadingMore, offset]);

  const fetchPosts = async (reset = false) => {
    const token = localStorage.getItem('token');
    const currentOffset = reset ? 0 : offset;
    const limit = 100;
    
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/admin/posts/${type}?limit=${limit}&offset=${currentOffset}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`📊 Fetched ${data.data.length} ${type} (offset: ${currentOffset})`);
        
        if (reset) {
          setPosts(data.data);
        } else {
          setPosts(prev => [...prev, ...data.data]);
        }
        
        setOffset(currentOffset + data.data.length);
        setHasMore(data.data.length === limit);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };


  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const submitData = new FormData();
    const dataToSubmit = { ...formData, post_page: type };
    
    console.log('📝 Submitting post:', editingItem ? 'UPDATE' : 'CREATE');
    console.log('📝 Data:', dataToSubmit);
    
    Object.keys(dataToSubmit).forEach(key => {
      if (dataToSubmit[key] !== null && dataToSubmit[key] !== undefined && dataToSubmit[key] !== '') {
        submitData.append(key, dataToSubmit[key]);
      }
    });
    
    if (thumbnailFile) {
      console.log('🖼️ Adding thumbnail file');
      submitData.append('thumbnail', thumbnailFile);
    }
    if (bannerFile) {
      console.log('🖼️ Adding banner file');
      submitData.append('banner', bannerFile);
    }

    try {
      const url = editingItem
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/admin/posts/${editingItem.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/admin/posts`;

      console.log('📤 URL:', url);

      const response = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      console.log('📥 Status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Response:', data);
        alert(editingItem ? 'Post updated successfully! Check the list.' : 'Post created successfully!');
        setShowModal(false);
        resetForm();
        // Reload the page to see fresh data
        window.location.reload();
      } else {
        const error = await response.json();
        console.error('❌ Error:', error);
        alert(`Error: ${error.message || 'Failed to save'}`);
      }
    } catch (error) {
      console.error('❌ Submit error:', error);
      alert('Failed to save post: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      post_title: item.post_title,
      post_short_desc: item.post_short_desc || '',
      post_desc: item.post_desc || '',
      post_page: item.post_page,
      post_category: item.post_category || '',
      post_designation: item.post_designation || '',
      post_company: item.post_company || '',
      post_country: item.post_country || '',
      post_more_link: item.post_more_link || '',
      post_register_link: item.post_register_link || '',
      post_thumbnail: item.post_thumbnail || '',
      post_banner: item.post_banner || '',
      post_status: item.post_status || 'active',
      post_priority: item.post_priority || 0
    });
    // Use URL versions for preview if available (from S3)
    setThumbnailPreview(item.post_thumbnail_url || item.post_thumbnail);
    setBannerPreview(item.post_banner_url || item.post_banner);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Post deleted successfully!');
        fetchPosts();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete post');
    }
  };

  const resetForm = () => {
    setFormData({
      post_title: '',
      post_short_desc: '',
      post_desc: '',
      post_page: '',
      post_category: '',
      post_designation: '',
      post_company: '',
      post_country: '',
      post_more_link: '',
      post_register_link: '',
      post_thumbnail: '',
      post_banner: '',
      post_status: 'active',
      post_priority: 0
    });
    setEditingItem(null);
    setThumbnailFile(null);
    setBannerFile(null);
    setThumbnailPreview(null);
    setBannerPreview(null);
    setPriorityConflict(null);
    setSuggestedPriority(null);
  };

  if (!type) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{typeLabels[type] || type} Management</h1>
            <p className="text-gray-600">Manage {typeLabels[type]?.toLowerCase() || type} posts</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            + Add {typeLabels[type]?.slice(0, -1) || 'Post'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : (type === 'partners' || type === 'resources' || type === 'tenders') ? (
          /* Table View for Partnerships, Resources, and Tenders */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {type === 'partners' ? 'Company' : type === 'tenders' ? 'Title' : 'Resource Name'}
                  </th>
                  {type === 'partners' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Logo/Image
                    </th>
                  )}
                  {type === 'tenders' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Website/Link
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-md">
                        {item.post_title}
                      </div>
                      {item.post_short_desc && (
                        <div className="text-xs text-gray-500 max-w-md truncate mt-1">
                          {item.post_short_desc}
                        </div>
                      )}
                      {item.post_company && (
                        <div className="text-xs text-gray-600 mt-1">🏢 {item.post_company}</div>
                      )}
                    </td>
                    {type === 'partners' && (
                      <td className="px-6 py-4">
                        {(item.post_thumbnail_url || item.post_banner_url || item.post_thumbnail || item.post_banner) ? (
                          <img
                            src={item.post_thumbnail_url || item.post_banner_url || item.post_thumbnail || item.post_banner}
                            alt={item.post_title}
                            className="h-24 w-32 object-contain bg-white p-2 rounded border border-gray-200"
                          />
                        ) : (
                          <div className="h-24 w-32 bg-gray-100 flex items-center justify-center rounded border border-gray-200">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </td>
                    )}
                    {type === 'tenders' && (
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.post_country || '-'}
                      </td>
                    )}
                    <td className="px-6 py-4">
                      {item.post_more_link ? (
                        <a 
                          href={item.post_more_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
                        >
                          View Website →
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {posts.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500">No {typeLabels[type]?.toLowerCase() || 'items'} found</p>
              </div>
            )}
            {/* Infinite Scroll Trigger */}
            {posts.length > 0 && (
              <div ref={loadMoreRef} className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                {loadingMore ? (
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                    <span>Loading more {typeLabels[type]?.toLowerCase()}...</span>
                  </div>
                ) : hasMore ? (
                  <div className="text-center text-sm text-gray-500">
                    Scroll down to load more... ({posts.length} loaded)
                  </div>
                ) : (
                  <div className="text-center text-sm text-gray-600 font-medium">
                    ✓ All {posts.length} {typeLabels[type]?.toLowerCase()} loaded
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Card/Grid View for Blogs and Stories */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                {(item.post_thumbnail_url || item.post_banner_url || item.post_thumbnail || item.post_banner) ? (
                  <div className="relative h-48">
                    <img
                      src={item.post_thumbnail_url || item.post_banner_url || item.post_thumbnail || item.post_banner}
                      alt={item.post_title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                      item.post_status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                    }`}>
                      {item.post_status === 'active' ? 'Active' : 'Inactive'}
                    </div>
                    {/* Image attribution */}
                    {(item.post_designation || item.post_company) && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-xs font-medium truncate">
                          {item.post_company || item.post_designation}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-gray-500">No image</p>
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.post_title}</h3>
                  {item.post_category && (
                    <div className="mb-2">
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                        {item.post_category}
                      </span>
                    </div>
                  )}
                  {item.post_short_desc && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.post_short_desc}</p>
                  )}
                  {(item.post_designation || item.post_company || item.post_country) && (
                    <div className="text-xs text-gray-500 mb-3 space-y-1">
                      {item.post_designation && <div>📋 {item.post_designation}</div>}
                      {item.post_company && <div>🏢 {item.post_company}</div>}
                      {item.post_country && <div>🌍 {item.post_country}</div>}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No {typeLabels[type]?.toLowerCase() || 'posts'} found. Create your first one!</p>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {editingItem ? `Edit ${typeLabels[type]?.slice(0, -1)}` : `Add ${typeLabels[type]?.slice(0, -1)}`}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.post_title}
                        onChange={(e) => setFormData({ ...formData, post_title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Short Description
                      </label>
                      <textarea
                        value={formData.post_short_desc}
                        onChange={(e) => setFormData({ ...formData, post_short_desc: e.target.value })}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>

                    {type === 'blogs' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={formData.post_category}
                          onChange={(e) => setFormData({ ...formData, post_category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="">Select Category</option>
                          <option value="Retail & E-commerce">Retail & E-commerce</option>
                          <option value="Customer Experience">Customer Experience</option>
                          <option value="Leadership & Workplace Culture">Leadership & Workplace Culture</option>
                          <option value="Entrepreneurship">Entrepreneurship</option>
                        </select>
                      </div>
                    )}

                    {(type === 'resources' || type === 'tenders') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          value={formData.post_country}
                          onChange={(e) => setFormData({ ...formData, post_country: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                          placeholder="e.g., India, USA"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Description
                      </label>
                      <textarea
                        value={formData.post_desc}
                        onChange={(e) => setFormData({ ...formData, post_desc: e.target.value })}
                        rows="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        placeholder="HTML content is supported"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Designation
                        </label>
                        <input
                          type="text"
                          value={formData.post_designation}
                          onChange={(e) => setFormData({ ...formData, post_designation: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          value={formData.post_company}
                          onChange={(e) => setFormData({ ...formData, post_company: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          More Info Link
                        </label>
                        <input
                          type="url"
                          value={formData.post_more_link}
                          onChange={(e) => setFormData({ ...formData, post_more_link: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                          placeholder="https://example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Registration Link
                        </label>
                        <input
                          type="url"
                          value={formData.post_register_link}
                          onChange={(e) => setFormData({ ...formData, post_register_link: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                          placeholder="https://example.com/register"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority (Lower number = Shows First, e.g., 1 shows before 2)
                      </label>
                      <input
                        type="number"
                        value={formData.post_priority}
                        onChange={(e) => setFormData({ ...formData, post_priority: parseInt(e.target.value) || 0 })}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                          priorityConflict ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300'
                        }`}
                        min="0"
                      />
                      {priorityConflict && (
                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <p className="text-sm text-yellow-800 mb-2">
                            ⚠️ {priorityConflict.message}
                          </p>
                          {suggestedPriority && (
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-yellow-700">
                                Suggested priority: <strong>{suggestedPriority}</strong>
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, post_priority: suggestedPriority });
                                  setPriorityConflict(null);
                                  setSuggestedPriority(null);
                                }}
                                className="text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors"
                              >
                                Use {suggestedPriority}
                              </button>
                            </div>
                          )}
                          <p className="text-xs text-yellow-600 mt-2">
                            Note: The backend will automatically assign the next available priority if you proceed.
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Priority 1 appears first, then 2, 3, etc. Leave as 0 for no priority.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Thumbnail Image {editingItem && '(Replace)'}
                        </label>
                        {editingItem && thumbnailPreview && (
                          <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-xs text-blue-800 mb-1">Current Image for: <strong>{formData.post_title}</strong></p>
                            <img src={thumbnailPreview} alt="Current Thumbnail" className="w-full h-32 object-cover rounded" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {editingItem ? '📤 Upload new image to replace current one (stores in S3)' : '📤 Upload image (will be stored in S3)'}
                        </p>
                        {!editingItem && thumbnailPreview && (
                          <div className="mt-2">
                            <p className="text-xs text-green-600 mb-1">New image preview:</p>
                            <img src={thumbnailPreview} alt="New Thumbnail" className="w-full h-32 object-cover rounded border-2 border-green-300" />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Banner Image {editingItem && '(Replace)'}
                        </label>
                        {editingItem && bannerPreview && (
                          <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-xs text-blue-800 mb-1">Current Image for: <strong>{formData.post_title}</strong></p>
                            <img src={bannerPreview} alt="Current Banner" className="w-full h-32 object-cover rounded" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBannerChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {editingItem ? '📤 Upload new image to replace current one (stores in S3)' : '📤 Upload image (will be stored in S3)'}
                        </p>
                        {!editingItem && bannerPreview && (
                          <div className="mt-2">
                            <p className="text-xs text-green-600 mb-1">New image preview:</p>
                            <img src={bannerPreview} alt="New Banner" className="w-full h-32 object-cover rounded border-2 border-green-300" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.post_status}
                        onChange={(e) => setFormData({ ...formData, post_status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      {editingItem ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

