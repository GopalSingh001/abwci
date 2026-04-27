import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function CountriesManagement() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // Cache for API-enriched data per country id
  const [derived, setDerived] = useState({});
  const [formData, setFormData] = useState({
    country: '',
    code: '',
    country_flag: ''
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  // Fetch country details (name, flag) from Rest Countries API using ISO code
  const fetchFromRestCountries = async (code) => {
    if (!code || code.length < 2) return;
    try {
      const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
      if (!res.ok) return;
      const data = await res.json();
      const countryData = Array.isArray(data) ? data[0] : data;
      if (!countryData) return;
      setFormData((prev) => ({
        ...prev,
        country: countryData?.name?.common || prev.country,
        // Use FlagCDN for flag images based on ISO code
        country_flag: `https://flagcdn.com/w40/${code.toLowerCase()}.png`
      }));
    } catch (err) {
      console.error('Failed to fetch from Rest Countries API:', err);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/countries`);
      if (response.ok) {
        const data = await response.json();
        const list = data.data || [];
        setCountries(list);
        // Enrich with code/flag from API when missing
        enrichMissingCountryData(list);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Enrich codes/flags using Rest Countries by country name
  const enrichMissingCountryData = async (list) => {
    const updates = {};
    // Limit parallelism to avoid rate limits
    const chunks = [];
    const pending = list.map((c) => async () => {
      try {
        // Always prefer API-derived code/flag; ignore DB flag
        const name = encodeURIComponent(c.country);
        const res = await fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,cca2,cca3,flags`);
        if (!res.ok) return;
        const arr = await res.json();
        const rc = Array.isArray(arr) ? arr[0] : arr;
        if (!rc) return;
        const code2 = (rc.cca2 || rc.cca3 || '').toUpperCase();
        const flagUrl = code2 ? `https://flagcdn.com/w40/${code2.toLowerCase()}.png` : undefined;
        updates[c.id] = {
          code: code2 || c.code,
          flag: flagUrl
        };
      } catch (e) {
        // ignore per item errors
      }
    });
    // Run with concurrency 5
    for (let i = 0; i < pending.length; i += 5) {
      chunks.push(Promise.all(pending.slice(i, i + 5).map((fn) => fn())));
    }
    await Promise.all(chunks);
    setDerived((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingCountry 
        ? `${process.env.NEXT_PUBLIC_API_URL}/countries/${editingCountry.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/countries`;
      
      const method = editingCountry ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(editingCountry ? 'Country updated successfully!' : 'Country created successfully!');
        setShowModal(false);
        resetForm();
        fetchCountries();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save country');
    }
  };

  const handleEdit = (country) => {
    setEditingCountry(country);
    setFormData({
      country: country.country || '',
      code: country.code || '',
      country_flag: country.country_flag || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this country?')) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/countries/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Country deleted successfully!');
        fetchCountries();
      } else {
        alert('Failed to delete country');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete country');
    }
  };

  const resetForm = () => {
    setFormData({
      country: '',
      code: '',
      country_flag: ''
    });
    setEditingCountry(null);
  };

  const filteredCountries = countries.filter(country =>
    country.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Countries Management</h1>
            <p className="text-gray-600">Manage countries and their details</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add Country
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search countries..."
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
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flag
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCountries.map((country) => (
                    <tr key={country.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {country.country}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {country.code || derived[country.id]?.code || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {derived[country.id]?.flag ? (
                            <img src={derived[country.id]?.flag} alt={`${country.country} flag`} className="h-4 w-6 object-cover rounded-sm border" />
                          ) : (
                            '-'
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(country)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(country.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredCountries.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No countries found</p>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {editingCountry ? 'Edit Country' : 'Add Country'}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country Code *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength="3"
                        value={formData.code}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase();
                          setFormData({ ...formData, code: value });
                          if (value.length >= 2) {
                            fetchFromRestCountries(value);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        placeholder="ISO code e.g., IN, US, GBR"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country Flag
                      </label>
                      <input
                        type="text"
                        value={formData.country_flag}
                        onChange={(e) => setFormData({ ...formData, country_flag: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Flag image URL (auto-fills)"
                      />
                      {formData.country_flag && (
                        <div className="mt-2">
                          <img src={formData.country_flag} alt="Flag preview" className="h-6 w-8 object-cover rounded-sm border" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      {editingCountry ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
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
