import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, DollarSign, Clock, CheckCircle, LogOut, Search, Filter, Trash2, TrendingUp, Users, Zap, ChevronDown, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';
import { getIsAuthenticated, getAdminOrders, getAdminStats, adminLogout, updateOrderStatusAdmin, deleteOrderAdmin } from '../../store/adminSlice';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../ui/Button';
import ConfirmDialog from '../../ui/ConfirmDialog';
import Container from '../../layout/Container';

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(getIsAuthenticated);
  const orders = useSelector(getAdminOrders);
  const stats = useSelector(getAdminStats);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  if (!isAuthenticated) { navigate('/admin/login'); return null; }

  // Advanced filtering & sorting
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

  // Additional computed stats
  const avgOrderValue = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;
  const priorityOrders = orders.filter(o => o.priority).length;

  const handleLogout = () => { dispatch(adminLogout()); toast.success('Logged out', { id: 'logout' }); navigate('/admin/login'); };
  const handleStatusChange = (orderId, newStatus) => { dispatch(updateOrderStatusAdmin({ orderId, status: newStatus })); toast.success('Status updated', { id: 'status' }); };
  const handleDeleteOrder = () => { if (orderToDelete) { dispatch(deleteOrderAdmin(orderToDelete)); toast.success('Order deleted', { id: 'delete' }); setOrderToDelete(null); } };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-black mb-8 border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(220,38,38,0.15),transparent_50%)]" />
        <Container className="relative z-10 py-12 md:py-16">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
              <div className="p-3 bg-red-600/20 rounded-2xl border border-red-500/30">
                <LayoutDashboard className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white">Admin Dashboard</h1>
                <p className="text-gray-400">Manage orders & track performance</p>
              </div>
            </motion.div>
            <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 border border-red-500/30 hover:bg-red-600/10">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </Container>
      </section>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 mb-8">
        <StatCard icon={<Package />} title="Total Orders" value={stats.totalOrders} color="blue" />
        <StatCard icon={<DollarSign />} title="Revenue" value={formatCurrency(stats.totalRevenue)} color="green" />
        <StatCard icon={<Clock />} title="Active" value={stats.activeOrders} color="yellow" />
        <StatCard icon={<CheckCircle />} title="Completed" value={stats.completedOrders} color="emerald" />
        <StatCard icon={<TrendingUp />} title="Avg. Order" value={formatCurrency(avgOrderValue)} color="purple" />
        <StatCard icon={<Zap />} title="Priority" value={priorityOrders} color="orange" />
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 rounded-2xl border border-white/10 p-4 mb-6 backdrop-blur-sm">
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-zinc-900/50 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-800/50 border-b border-white/10">
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Priority', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No orders found</td></tr>
              ) : (
                <AnimatePresence>
                  {filteredOrders.map((order) => (
                    <OrderRow key={order.id} order={order} onStatusChange={handleStatusChange} onDelete={() => setOrderToDelete(order.id)} />
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <ConfirmDialog isOpen={!!orderToDelete} onClose={() => setOrderToDelete(null)} onConfirm={handleDeleteOrder} title="Delete this order?" message="This will permanently delete the order. This action cannot be undone." confirmText="Yes, delete" cancelText="Cancel" variant="danger" />
    </>
  );
}

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
  const statusColors = {
    preparing: 'bg-yellow-500/20 text-yellow-400',
    delivering: 'bg-blue-500/20 text-blue-400',
    delivered: 'bg-green-500/20 text-green-400',
  };
  return (
    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-white/5 transition-colors">
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

export default AdminDashboard;
