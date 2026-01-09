import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  LogOut,
  Search,
  Filter,
  Trash2,
  Edit,
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  getIsAuthenticated,
  getAdminOrders,
  getAdminStats,
  adminLogout,
  updateOrderStatusAdmin,
  deleteOrderAdmin,
} from '../../store/adminSlice';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../ui/Button';
import ConfirmDialog from '../../ui/ConfirmDialog';

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(getIsAuthenticated);
  const orders = useSelector(getAdminOrders);
  const stats = useSelector(getAdminStats);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleLogout = () => {
    dispatch(adminLogout());
    toast.success('Logged out successfully', { id: 'logout' });
    navigate('/admin/login');
  };

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatusAdmin({ orderId, status: newStatus }));
    toast.success('Order status updated', { id: 'status-update' });
  };

  const handleDeleteOrder = () => {
    if (orderToDelete) {
      dispatch(deleteOrderAdmin(orderToDelete));
      toast.success('Order deleted', { id: 'delete-order' });
      setOrderToDelete(null);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-sp-black">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your pizza orders</p>
          </div>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Package className="w-6 h-6" />}
            title="Total Orders"
            value={stats.totalOrders}
            color="blue"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            color="green"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            title="Active Orders"
            value={stats.activeOrders}
            color="yellow"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            title="Completed"
            value={stats.completedOrders}
            color="purple"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order ID or customer..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none"
              >
                <option value="all">All Orders</option>
                <option value="preparing">Preparing</option>
                <option value="delivering">Delivering</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      onStatusChange={handleStatusChange}
                      onDelete={() => setOrderToDelete(order.id)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleDeleteOrder}
        title="Delete this order?"
        message="This will permanently delete the order from the system. This action cannot be undone."
        confirmText="Yes, delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}

// ============================================
// STAT CARD COMPONENT

function StatCard({ icon, title, value, color }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-sp-black">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// ORDER ROW COMPONENT

function OrderRow({ order, onStatusChange, onDelete }) {
  const statusColors = {
    preparing: 'bg-yellow-100 text-yellow-800',
    delivering: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-gray-900">#{order.id}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{order.customer || 'Guest'}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600">{order.items?.length || 0} items</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-semibold text-gray-900">
          {formatCurrency(order.totalPrice)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={order.status}
          onChange={(e) => onStatusChange(order.id, e.target.value)}
          className={`text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer ${
            statusColors[order.status]
          }`}
        >
          <option value="preparing">Preparing</option>
          <option value="delivering">Delivering</option>
          <option value="delivered">Delivered</option>
        </select>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-700 transition-colors"
          title="Delete order"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}

export default AdminDashboard;
