'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabasePublic } from '@/src/lib/supabase';
import { Plus, Edit, Trash2, X, Upload, ChevronDown } from 'lucide-react';

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authentication check - Strict Admin Email Restriction
  useEffect(() => {
    supabasePublic.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        supabasePublic.auth.signOut();
        setSession(null);
      } else {
        setSession(session);
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabasePublic.auth.onAuthStateChange((_event, session) => {
      if (session && session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        supabasePublic.auth.signOut();
        setSession(null);
      } else {
        setSession(session);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthSubmitting(true);
    setAuthError('');
    try {
      const { data, error } = await supabasePublic.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      if (data.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        await supabasePublic.auth.signOut();
        throw new Error('Access denied: Unauthorized email address.');
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabasePublic.auth.signOut();
  };

  // Form states for product CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isMatOpen, setIsMatOpen] = useState(false);
  const [isOccOpen, setIsOccOpen] = useState(false);

  const handleMaterialToggle = (mat) => {
    const currentList = productForm.material
      ? productForm.material.split(',').map(m => m.trim()).filter(Boolean)
      : [];
    const newList = currentList.includes(mat)
      ? currentList.filter(m => m !== mat)
      : [...currentList, mat];
    setProductForm({ ...productForm, material: newList.join(', ') });
  };

  const handleOccasionToggle = (occ) => {
    const currentList = productForm.occasion
      ? productForm.occasion.split(',').map(o => o.trim()).filter(Boolean)
      : [];
    const newList = currentList.includes(occ)
      ? currentList.filter(o => o !== occ)
      : [...currentList, occ];
    setProductForm({ ...productForm, occasion: newList.join(', ') });
  };
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    price: '',
    category: 'jhumkas',
    images: ['/images/products/one.jpeg'],
    description: '',
    stockStatus: 'In Stock',
    tags: '',
    material: 'Gold Plated',
    occasion: 'Everyday',
    color: 'Gold'
  });

  // Fetch all admin data
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabasePublic.auth.getSession();
      const token = session?.access_token;

      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('/api/products')
      ]);

      if (ordersRes.ok && productsRes.ok) {
        const [ordersData, productsData] = await Promise.all([
          ordersRes.json(),
          productsRes.json()
        ]);
        setOrders(ordersData.reverse()); // Show newest orders first
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data: { session } } = await supabasePublic.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders(prev =>
          prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
        );
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Status update error:', error);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { data: { session } } = await supabasePublic.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Product delete error:', error);
    }
  };

  // Open modal for add or edit
  const openModal = (product = null) => {
    setIsMatOpen(false);
    setIsOccOpen(false);
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name || '',
        sku: product.sku || '',
        price: product.price || '',
        category: product.category || 'jhumkas',
        images: product.images || ['/images/products/one.jpeg'],
        description: product.description || '',
        stockStatus: product.stockStatus || 'In Stock',
        tags: product.tags ? product.tags.join(', ') : '',
        material: product.material || 'Gold Plated',
        occasion: product.occasion || 'Everyday',
        color: product.color || 'Gold'
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        sku: '',
        price: '',
        category: 'jhumkas',
        images: ['/images/products/one.jpeg'],
        description: '',
        stockStatus: 'In Stock',
        tags: '',
        material: 'Gold Plated',
        occasion: 'Everyday',
        color: 'Gold'
      });
    }
    setIsModalOpen(true);
  };

  // Submit product Form
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const formattedPayload = {
      ...productForm,
      price: parseFloat(productForm.price),
      tags: productForm.tags.split(',').map(t => t.trim()).filter(t => t !== '')
    };

    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const { data: { session } } = await supabasePublic.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedPayload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Product submit error:', error);
    }
  };

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { session } } = await supabasePublic.auth.getSession();
      const token = session?.access_token;

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setProductForm(prev => ({
          ...prev,
          images: prev.images[0] === '/images/products/one.jpeg' 
            ? [data.url] 
            : [...prev.images, data.url]
        }));
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('An error occurred during upload.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Calculate analytics totals
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const averageOrder = orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : 0;
  const lowStockProducts = products.filter(p => p.stockStatus === 'Low Stock' || p.stockStatus === 'Out of Stock').length;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 font-medium">Checking authorization status...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-display font-bold text-jewelry-900">Admin Sign In</h2>
            <p className="text-gray-500 text-sm mt-2">Access the Jhumkas by Malti management console</p>
          </div>
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-jewelry-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-jewelry-500"
              />
            </div>
            {authError && (
              <p className="text-red-500 text-xs font-semibold">{authError}</p>
            )}
            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full bg-jewelry-600 hover:bg-jewelry-700 text-white py-2.5 rounded font-bold shadow-sm transition-colors text-sm"
            >
              {authSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Title Header */}
      <div className="bg-gray-900 text-white py-8 shadow-sm">
        <div className="container-custom flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Store Administration</h1>
            <p className="text-gray-400 text-sm mt-1">Manage catalog products and process customer orders</p>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm transition-colors border border-white/20">
              View Storefront
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold transition-colors shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom mt-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8 bg-white rounded-lg shadow-sm p-1">
          {[
            { id: 'orders', label: 'Orders Log', count: orders.length },
            { id: 'products', label: 'Products Manager', count: products.length },
            { id: 'analytics', label: 'Analytics Insights', count: null }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-md font-semibold text-sm transition-all flex justify-center items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-jewelry-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading admin logs...</div>
        ) : (
          <>
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">Orders History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                      <tr>
                        <th className="p-4">Invoice No</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Delivery Address</th>
                        <th className="p-4">Total Value</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {orders.length > 0 ? (
                        orders.map(order => (
                          <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-4 font-mono font-bold text-jewelry-700">{order.invoiceNo}</td>
                            <td className="p-4 text-xs text-gray-400">{new Date(order.date).toLocaleDateString()}</td>
                            <td className="p-4 font-medium">{order.customer.firstName} {order.customer.lastName}</td>
                            <td className="p-4 text-xs font-mono">{order.customer.phone}</td>
                            <td className="p-4 text-xs max-w-xs truncate" title={`${order.customer.address}, ${order.customer.city}`}>
                              {order.customer.address}, {order.customer.city}
                            </td>
                            <td className="p-4 font-semibold text-gray-900">₹{order.total.toFixed(2)}</td>
                            <td className="p-4">
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                className={`text-xs px-2.5 py-1.5 rounded-full font-bold border transition-colors ${
                                  order.status === 'New' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                  order.status === 'Processing' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                  order.status === 'Shipped' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                                  'bg-green-50 border-green-200 text-green-700'
                                }`}
                              >
                                <option value="New">New</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="p-12 text-center text-gray-400">No orders received yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
                  <h3 className="text-lg font-bold text-gray-800">Products Catalog</h3>
                  <button
                    onClick={() => openModal()}
                    className="bg-jewelry-600 hover:bg-jewelry-700 text-white px-4 py-2 rounded text-sm font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add New Product
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                      <tr>
                        <th className="p-4">SKU / Image</th>
                        <th className="p-4">Product Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Specs</th>
                        <th className="p-4">Stock Status</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {products.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img src={product.image || product.images?.[0]} alt={product.name} className="w-10 h-10 object-cover rounded border border-gray-100" />
                            <span className="font-mono text-xs text-gray-400">{product.sku}</span>
                          </td>
                          <td className="p-4 font-semibold text-gray-800">{product.name}</td>
                          <td className="p-4 text-xs capitalize">{product.category}</td>
                          <td className="p-4 font-bold">₹{product.price.toLocaleString('en-IN')}</td>
                          <td className="p-4 text-xs text-gray-500">
                            {product.material} / {product.color}
                          </td>
                          <td className="p-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                              product.stockStatus === 'In Stock' ? 'bg-green-50 text-green-700' :
                              product.stockStatus === 'Low Stock' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {product.stockStatus}
                            </span>
                          </td>
                          <td className="p-4 space-x-2">
                            <button
                              onClick={() => openModal(product)}
                              className="text-blue-500 hover:text-blue-700 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors inline-flex items-center"
                            >
                              <Edit className="w-3 h-3 mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-500 hover:text-red-700 font-medium text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors inline-flex items-center"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Gross Sales</span>
                    <span className="text-3xl font-bold text-jewelry-600 mt-2">₹{totalRevenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Orders</span>
                    <span className="text-3xl font-bold text-gray-800 mt-2">{orders.length}</span>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Avg Order Value</span>
                    <span className="text-3xl font-bold text-gray-800 mt-2">₹{Number(averageOrder).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Alert Status</span>
                    <span className={`text-3xl font-bold mt-2 ${lowStockProducts > 0 ? 'text-amber-500' : 'text-green-600'}`}>
                      {lowStockProducts > 0 ? `${lowStockProducts} Low Stock` : 'Healthy'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Form Modal (Add / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden my-8">
            <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold font-display">{editingProduct ? 'Edit Catalog Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleProductSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-jewelry-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-jewelry-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-jewelry-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-jewelry-500"
                  >
                    <option value="jhumkas">Jhumkas</option>
                    <option value="meenakari">Meenakari</option>
                    <option value="chandbali">Chandbali</option>
                    <option value="bridal sets">Bridal Sets</option>
                    <option value="everyday">Everyday Wear</option>
                    <option value="bangles">Bangles</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Material</label>
                  <button
                    type="button"
                    onClick={() => { setIsMatOpen(!isMatOpen); setIsOccOpen(false); }}
                    className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-left flex justify-between items-center focus:outline-none focus:ring-1 focus:ring-jewelry-500 h-[38px]"
                  >
                    <span className="truncate">
                      {productForm.material || 'Select Materials'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500 ml-1 shrink-0" />
                  </button>
                  {isMatOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsMatOpen(false)} />
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg p-2 space-y-1 max-h-60 overflow-y-auto">
                        {['Gold Plated', 'Silver', 'Brass'].map((mat) => {
                          const isChecked = productForm.material
                            ?.split(',')
                            .map(m => m.trim())
                            .includes(mat);
                          return (
                            <label key={mat} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded text-sm cursor-pointer font-medium text-gray-700">
                              <input
                                type="checkbox"
                                checked={isChecked || false}
                                onChange={() => handleMaterialToggle(mat)}
                                className="rounded border-gray-300 text-jewelry-600 focus:ring-jewelry-500"
                              />
                              <span>{mat}</span>
                            </label>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Color</label>
                  <input
                    type="text"
                    value={productForm.color}
                    onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-jewelry-500"
                  />
                </div>
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Occasion</label>
                  <button
                    type="button"
                    onClick={() => { setIsOccOpen(!isOccOpen); setIsMatOpen(false); }}
                    className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-left flex justify-between items-center focus:outline-none focus:ring-1 focus:ring-jewelry-500 h-[38px]"
                  >
                    <span className="truncate">
                      {productForm.occasion || 'Select Occasions'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500 ml-1 shrink-0" />
                  </button>
                  {isOccOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsOccOpen(false)} />
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg p-2 space-y-1 max-h-60 overflow-y-auto">
                        {['Bridal / Wedding', 'Festive / Traditional', 'Everyday Wear'].map((occ) => {
                          const isChecked = productForm.occasion
                            ?.split(',')
                            .map(o => o.trim())
                            .includes(occ);
                          return (
                            <label key={occ} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded text-sm cursor-pointer font-medium text-gray-700">
                              <input
                                type="checkbox"
                                checked={isChecked || false}
                                onChange={() => handleOccasionToggle(occ)}
                                className="rounded border-gray-300 text-jewelry-600 focus:ring-jewelry-500"
                              />
                              <span>{occ}</span>
                            </label>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Description *</label>
                <textarea
                  required
                  rows="3"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-jewelry-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Product Images</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {productForm.images?.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 border rounded-lg overflow-hidden group">
                      <img src={img} alt="Product preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProductForm(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== idx)
                        }))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        aria-label="Remove image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <label className={`cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Upload className="w-4 h-4 mr-2" /> {uploading ? 'Uploading...' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-gray-500">Supports JPG, PNG, WEBP (Max 5MB)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Stock Status *</label>
                  <select
                    value={productForm.stockStatus}
                    onChange={(e) => setProductForm({ ...productForm, stockStatus: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-jewelry-500"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={productForm.tags}
                    placeholder="festive, gold, classic"
                    onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-jewelry-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-jewelry-600 hover:bg-jewelry-700 text-white px-4 py-2 rounded text-sm font-semibold shadow-sm transition-colors"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
