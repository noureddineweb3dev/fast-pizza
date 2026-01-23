import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, DollarSign, Clock, CheckCircle, LogOut, Search, Filter, Trash2,
  TrendingUp, Zap, ChevronDown, LayoutDashboard, UtensilsCrossed, Edit2,
  Plus, X, Save, Eye, EyeOff, Flame, Leaf, Award, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getIsAuthenticated, getAdminOrders, getAdminStats, adminLogout,
  updateOrderStatusAdmin, deleteOrderAdmin
} from '../../store/adminSlice';
import { formatCurrency } from '../../utils/helpers';
import { getMenu, updateMenuItem, createMenuItem, deleteMenuItem, getAllOrders, updateOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import ConfirmDialog from '../../ui/ConfirmDialog';
import Container from '../../layout/Container';

const CATEGORIES = ['pizza', 'side', 'drink', 'dessert', 'combo'];

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(getIsAuthenticated);
  const orders = useSelector(getAdminOrders);
  const stats = useSelector(getAdminStats);

  const [activeTab, setActiveTab] = useState('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  // Menu state
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [menuSearch, setMenuSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) { navigate('/admin/login'); return; }
    if (activeTab === 'menu') loadMenu();
  }, [isAuthenticated, navigate, activeTab]);

  const loadMenu = async () => {
    setMenuLoading(true);
    try {
      const data = await getMenu();
      setMenuItems(data);
    } catch (err) {
      toast.error('Failed to load menu');
    } finally {
      setMenuLoading(false);
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let result = orders.filter((order) => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || order.customer?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === 'highest') result.sort((a, b) => b.totalPrice - a.totalPrice);
    else if (sortBy === 'lowest') result.sort((a, b) => a.totalPrice - b.totalPrice);
    return result;
  }, [orders, searchQuery, statusFilter, sortBy]);

  // Filtered menu
  const filteredMenu = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [menuItems, menuSearch, categoryFilter]);

  const avgOrderValue = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;
  const priorityOrders = orders.filter(o => o.priority).length;

  const handleLogout = () => { dispatch(adminLogout()); toast.success('Logged out'); navigate('/admin/login'); };
  const handleStatusChange = async (orderId, newStatus) => {
    dispatch(updateOrderStatusAdmin({ orderId, status: newStatus }));
    try { await updateOrder(orderId, { status: newStatus }); toast.success('Status updated'); } catch { toast.error('Failed to update'); }
  };
  const handleDeleteOrder = () => { if (orderToDelete) { dispatch(deleteOrderAdmin(orderToDelete)); toast.success('Order deleted'); setOrderToDelete(null); } };

  // Menu handlers
  const handleToggleAvailability = async (item) => {
    const newAvailable = !item.available;
    setMenuItems(prev => prev.map(i => i.id === item.id ? { ...i, available: newAvailable } : i));
    try {
      await updateMenuItem(item.id, { available: newAvailable });
      toast.success(newAvailable ? 'Item is now available' : 'Item marked as unavailable');
    } catch { toast.error('Failed to update'); }
  };

  const handleSaveEdit = async (item) => {
    try {
      await updateMenuItem(item.id, item);
      setMenuItems(prev => prev.map(i => i.id === item.id ? item : i));
      setEditingItem(null);
      toast.success('Item updated');
    } catch { toast.error('Failed to save'); }
  };

  const handleAddItem = async (newItem) => {
    try {
      const created = await createMenuItem(newItem);
      setMenuItems(prev => [...prev, { ...created, unitPrice: created.price }]);
      setShowAddForm(false);
      toast.success('Item added');
    } catch { toast.error('Failed to add item'); }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMenuItem(itemToDelete);
      setMenuItems(prev => prev.filter(i => i.id !== itemToDelete));
      toast.success('Item deleted');
    } catch { toast.error('Failed to delete'); }
    setItemToDelete(null);
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-black mb-8 border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(220,38,38,0.15),transparent_50%)]" />
        <Container className="relative z-10 py-10 md:py-14">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
              <div className="p-3 bg-red-600/20 rounded-2xl border border-red-500/30">
                <LayoutDashboard className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white">Admin Dashboard</h1>
                <p className="text-gray-400">Manage orders & menu</p>
              </div>
            </motion.div>
            <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 border border-red-500/30 hover:bg-red-600/10">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-8">
            {[{ id: 'orders', icon: Package, label: 'Orders' }, { id: 'menu', icon: UtensilsCrossed, label: 'Menu' }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id ? 'bg-red-600 text-white' : 'bg-zinc-800/50 text-gray-400 hover:text-white hover:bg-zinc-700/50'}`}>
                <tab.icon className="w-5 h-5" /> {tab.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {activeTab === 'orders' && (
        <>
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 mb-8">
            <StatCard icon={<Package />} title="Total Orders" value={stats.totalOrders} color="blue" />
            <StatCard icon={<DollarSign />} title="Revenue" value={formatCurrency(stats.totalRevenue)} color="green" />
            <StatCard icon={<Clock />} title="Active" value={stats.activeOrders} color="yellow" />
            <StatCard icon={<CheckCircle />} title="Completed" value={stats.completedOrders} color="emerald" />
            <StatCard icon={<TrendingUp />} title="Avg. Order" value={formatCurrency(avgOrderValue)} color="purple" />
            <StatCard icon={<Zap />} title="Priority" value={priorityOrders} color="orange" />
          </div>

          {/* Order Filters */}
          <motion.div className="bg-zinc-900/50 rounded-2xl border border-white/10 p-4 mb-6 backdrop-blur-sm">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search orders..." className="w-full bg-zinc-800 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600" />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-zinc-800 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none cursor-pointer">
                  <option value="all">All Status</option>
                  <option value="preparing">Preparing</option>
                  <option value="delivering">Delivering</option>
                  <option value="delivered">Delivered</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
              <div className="relative">
                <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full bg-zinc-800 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none cursor-pointer">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Value</option>
                  <option value="lowest">Lowest Value</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </motion.div>

          {/* Orders Table */}
          <motion.div className="bg-zinc-900/50 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800/50 border-b border-white/10">
                  <tr>
                    {['Order ID', 'Customer', 'Items', 'Total', 'Priority', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.length === 0 ? (
                    <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No orders found</td></tr>
                  ) : (
                    filteredOrders.map(order => (
                      <OrderRow key={order.id} order={order} onStatusChange={handleStatusChange} onDelete={() => setOrderToDelete(order.id)} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}

      {activeTab === 'menu' && (
        <>
          {/* Menu Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="text" value={menuSearch} onChange={(e) => setMenuSearch(e.target.value)} placeholder="Search menu..." className="w-full bg-zinc-800 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600" />
              </div>
              <div className="relative">
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none cursor-pointer pr-10">
                  <option value="all">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={loadMenu} className="!bg-zinc-800 !border-white/10 flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${menuLoading ? 'animate-spin' : ''}`} /> Refresh
              </Button>
              <Button variant="primary" onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Item
              </Button>
            </div>
          </div>

          {/* Menu Grid */}
          {menuLoading ? (
            <div className="text-center py-12 text-gray-500">Loading menu...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredMenu.map(item => (
                  <MenuItemCard key={item.id} item={item} onEdit={() => setEditingItem(item)} onToggle={() => handleToggleAvailability(item)} onDelete={() => setItemToDelete(item.id)} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      {editingItem && <EditItemModal item={editingItem} onClose={() => setEditingItem(null)} onSave={handleSaveEdit} />}

      {/* Add Modal */}
      {showAddForm && <AddItemModal onClose={() => setShowAddForm(false)} onAdd={handleAddItem} />}

      {/* Delete Confirmations */}
      <ConfirmDialog isOpen={!!orderToDelete} onClose={() => setOrderToDelete(null)} onConfirm={handleDeleteOrder} title="Delete this order?" message="This action cannot be undone." confirmText="Delete" cancelText="Cancel" variant="danger" />
      <ConfirmDialog isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={handleDeleteItem} title="Delete this menu item?" message="This will remove the item from your menu." confirmText="Delete" cancelText="Cancel" variant="danger" />
    </>
  );
}

// ============ COMPONENTS ============

function StatCard({ icon, title, value, color }) {
  const colors = {
    blue: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
    green: 'bg-green-600/20 text-green-400 border-green-500/30',
    yellow: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30',
    emerald: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
    purple: 'bg-purple-600/20 text-purple-400 border-purple-500/30',
    orange: 'bg-orange-600/20 text-orange-400 border-orange-500/30',
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 rounded-2xl border border-white/10 p-5 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colors[color]}`}>{icon}</div>
        <div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{title}</p>
          <p className="text-xl font-black text-white">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

function OrderRow({ order, onStatusChange, onDelete }) {
  const statusColors = { preparing: 'bg-yellow-500/20 text-yellow-400', delivering: 'bg-blue-500/20 text-blue-400', delivered: 'bg-green-500/20 text-green-400' };
  return (
    <motion.tr layout className="hover:bg-white/5 transition-colors">
      <td className="px-6 py-4"><span className="font-bold text-white">#{order.id}</span></td>
      <td className="px-6 py-4"><span className="text-gray-300">{order.customer || 'Guest'}</span></td>
      <td className="px-6 py-4"><span className="text-gray-400">{order.items?.length || 0} items</span></td>
      <td className="px-6 py-4"><span className="font-bold text-red-500">{formatCurrency(order.totalPrice)}</span></td>
      <td className="px-6 py-4">{order.priority ? <span className="flex items-center gap-1 text-orange-400 text-xs font-bold"><Zap className="w-3 h-3" /> Yes</span> : <span className="text-gray-500 text-xs">No</span>}</td>
      <td className="px-6 py-4">
        <select value={order.status} onChange={(e) => onStatusChange(order.id, e.target.value)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer ${statusColors[order.status]} bg-transparent focus:outline-none focus:ring-2 focus:ring-red-600`}>
          <option value="preparing" className="bg-zinc-900">Preparing</option>
          <option value="delivering" className="bg-zinc-900">Delivering</option>
          <option value="delivered" className="bg-zinc-900">Delivered</option>
        </select>
      </td>
      <td className="px-6 py-4">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onDelete} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-600/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></motion.button>
      </td>
    </motion.tr>
  );
}

function MenuItemCard({ item, onEdit, onToggle, onDelete }) {
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`bg-zinc-900/50 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm ${!item.available ? 'opacity-60' : ''}`}>
      <div className="relative h-32 bg-zinc-800">
        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
        <div className="absolute top-2 left-2 flex gap-1">
          {item.bestseller && <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full"><Award className="w-3 h-3" /></span>}
          {item.spicy && <span className="flex items-center gap-1 px-2 py-1 bg-orange-600 text-white text-xs font-bold rounded-full"><Flame className="w-3 h-3" /></span>}
          {item.vegetarian && <span className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded-full"><Leaf className="w-3 h-3" /></span>}
        </div>
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.available ? 'bg-green-600/80 text-white' : 'bg-red-600/80 text-white'}`}>{item.available ? 'In Stock' : 'Out of Stock'}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-white">{item.name}</h3>
          <span className="text-red-500 font-bold">{formatCurrency(item.unitPrice || item.price)}</span>
        </div>
        <p className="text-gray-400 text-xs mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-center gap-2">
          <button onClick={onToggle} className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${item.available ? 'bg-zinc-800 text-gray-400 hover:bg-zinc-700' : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'}`}>
            {item.available ? <><EyeOff className="w-3 h-3" /> Hide</> : <><Eye className="w-3 h-3" /> Show</>}
          </button>
          <button onClick={onEdit} className="flex items-center justify-center gap-1 px-3 py-2 bg-zinc-800 text-gray-400 hover:bg-zinc-700 rounded-lg text-xs font-bold transition-colors"><Edit2 className="w-3 h-3" /> Edit</button>
          <button onClick={onDelete} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-600/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    </motion.div>
  );
}

function EditItemModal({ item, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...item });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-black text-white">Edit Item</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div><label className="text-sm font-bold text-gray-400 block mb-1">Name</label><input name="name" value={formData.name} onChange={handleChange} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white" /></div>
          <div><label className="text-sm font-bold text-gray-400 block mb-1">Description</label><textarea name="description" value={formData.description || ''} onChange={handleChange} rows={2} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white resize-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-bold text-gray-400 block mb-1">Price (€)</label><input name="price" type="number" step="0.5" value={formData.price} onChange={handleChange} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white" /></div>
            <div><label className="text-sm font-bold text-gray-400 block mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="available" checked={formData.available} onChange={handleChange} className="accent-red-600" /><span className="text-gray-300">Available</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="bestseller" checked={formData.bestseller || false} onChange={handleChange} className="accent-yellow-500" /><span className="text-gray-300">Bestseller</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="spicy" checked={formData.spicy || false} onChange={handleChange} className="accent-orange-500" /><span className="text-gray-300">Spicy</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="vegetarian" checked={formData.vegetarian || false} onChange={handleChange} className="accent-green-500" /><span className="text-gray-300">Vegetarian</span></label>
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t border-white/10">
          <Button variant="secondary" onClick={onClose} className="flex-1 !bg-zinc-800 !border-white/10">Cancel</Button>
          <Button variant="primary" onClick={() => onSave({ ...formData, price: parseFloat(formData.price) })} className="flex-1 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</Button>
        </div>
      </motion.div>
    </div>
  );
}

function AddItemModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: 'pizza', available: true, bestseller: false, spicy: false, vegetarian: false, image: '' });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const handleSubmit = () => {
    if (!formData.name || !formData.price) { toast.error('Name and price required'); return; }
    onAdd({ ...formData, id: formData.name.toLowerCase().replace(/\s+/g, '-'), price: parseFloat(formData.price) });
  };
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-black text-white">Add New Item</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div><label className="text-sm font-bold text-gray-400 block mb-1">Name *</label><input name="name" value={formData.name} onChange={handleChange} placeholder="Pizza Name" className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500" /></div>
          <div><label className="text-sm font-bold text-gray-400 block mb-1">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={2} placeholder="Delicious description..." className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 resize-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-bold text-gray-400 block mb-1">Price (€) *</label><input name="price" type="number" step="0.5" value={formData.price} onChange={handleChange} placeholder="9.99" className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500" /></div>
            <div><label className="text-sm font-bold text-gray-400 block mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div><label className="text-sm font-bold text-gray-400 block mb-1">Image URL</label><input name="image" value={formData.image} onChange={handleChange} placeholder="/images/pizzas/new-pizza.png" className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500" /></div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="bestseller" checked={formData.bestseller} onChange={handleChange} className="accent-yellow-500" /><span className="text-gray-300">Bestseller</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="spicy" checked={formData.spicy} onChange={handleChange} className="accent-orange-500" /><span className="text-gray-300">Spicy</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="vegetarian" checked={formData.vegetarian} onChange={handleChange} className="accent-green-500" /><span className="text-gray-300">Vegetarian</span></label>
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t border-white/10">
          <Button variant="secondary" onClick={onClose} className="flex-1 !bg-zinc-800 !border-white/10">Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Item</Button>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;
