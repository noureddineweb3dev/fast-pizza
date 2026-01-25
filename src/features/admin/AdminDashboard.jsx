import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import PizzaLogo from '../../ui/PizzaLogo';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, DollarSign, Clock, CheckCircle, LogOut, Search, Filter, Trash2,
    TrendingUp, Zap, ChevronDown, LayoutDashboard, UtensilsCrossed, Edit2,
    Plus, X, Save, Eye, EyeOff, Flame, Leaf, Award, RefreshCw, Shield, Loader2, User
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
    getIsAuthenticated, getAdminOrders, getAdminStats, adminLogout,
    updateOrderStatusAdmin, deleteOrderAdmin, setOrdersAdmin
} from '../../store/adminSlice';
import { ORDER_STATUSES, STATUS_CATEGORIES, getStatusById } from '../../utils/orderStatuses';
import { formatCurrency } from '../../utils/helpers';
import { getMenu, updateMenuItem, createMenuItem, deleteMenuItem, getAllOrders, updateOrder, deleteOrder, createAdminUser, getAdmins, updateAdminUser, deleteAdminUser } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import Tooltip from '../../ui/Tooltip';
import ConfirmDialog from '../../ui/ConfirmDialog';
import Container from '../../layout/Container';

const CATEGORIES = ['pizza', 'side', 'drink', 'dessert', 'combo'];

const ROLE_DESCRIPTIONS = {
    admin: 'Full access including team management',
    manager: 'Can manage menu items and orders',
    staff: 'Can view and update order status only',
    blocked: 'Cannot login or access the system'
};

function AdminDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const orders = useSelector(getAdminOrders);
    const stats = useSelector(getAdminStats);

    const user = useSelector(state => state.admin.user);
    const role = user?.role || 'staff'; // Default to lowest privilege if undefined

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
    const [ordersLoading, setOrdersLoading] = useState(false);

    // Team state
    const [showAddMember, setShowAddMember] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login');
            return;
        }

        if (activeTab === 'menu') {
            loadMenu();
        } else if (activeTab === 'orders') {
            loadOrders();
        }
    }, [isAuthenticated, activeTab, navigate]);

    const loadMenu = async () => {
        if (menuLoading) return;
        setMenuLoading(true);
        try {
            const data = await getMenu();
            setMenuItems(data);
        } catch (err) {
            toast.error('Failed to load menu', { id: 'menu-error' });
        } finally {
            setMenuLoading(false);
        }
    };

    const loadOrders = async () => {
        if (ordersLoading) return;
        setOrdersLoading(true);
        try {
            const data = await getAllOrders();
            dispatch(setOrdersAdmin(data));
        } catch (err) {
            toast.error('Failed to sync orders from server', { id: 'orders-error' });
        } finally {
            setOrdersLoading(false);
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

    const handleDeleteOrder = async () => {
        if (orderToDelete) {
            dispatch(deleteOrderAdmin(orderToDelete));
            try {
                await deleteOrder(orderToDelete);
                toast.success('Order deleted from server');
            } catch {
                toast.error('Failed to delete from server');
            }
            setOrderToDelete(null);
        }
    };

    // Menu handlers
    const handleToggleAvailability = async (item) => {
        const newAvailable = !item.available;
        setMenuItems(prev => prev.map(i => i.id === item.id ? { ...i, available: newAvailable } : i));
        try {
            await updateMenuItem(item.id, { available: newAvailable });
            toast.success(newAvailable ? 'Item is now available' : 'Item marked as unavailable');
        } catch { toast.error('Failed to update'); }
    };

    const handleSaveEdit = async (item, formData) => {
        try {
            const updatedItem = await updateMenuItem(item.id, formData || item);
            setMenuItems(prev => prev.map(i => i.id === item.id ? { ...updatedItem } : i));
            setEditingItem(null);
            toast.success('Item updated');
        } catch {
            toast.error('Failed to save');
        }
    };

    const handleAddItem = async (newItemData) => {
        try {
            const created = await createMenuItem(newItemData);
            setMenuItems(prev => [...prev, created]);
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

    // Debug logging
    console.log('AdminDashboard Render:', { isAuthenticated, user, role, activeTab });

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Verifying Access...</h2>
                    <p className="text-gray-400 text-sm">Please wait while we check your credentials.</p>
                </div>
            </div>
        );
    }

    const canEditMenu = ['admin', 'manager'].includes(role);
    const canManageTeam = role === 'admin';

    // Tabs configuration
    const tabs = [
        { id: 'orders', icon: Package, label: 'Live Orders' },
        { id: 'menu', icon: UtensilsCrossed, label: 'Menu Management' },
        ...(canManageTeam ? [{ id: 'team', icon: Shield, label: 'Team Access' }] : []),
        { id: 'profile', icon: User, label: 'My Profile' }
    ];

    return (
        <div className="min-h-screen bg-black pb-20">
            {/* Header / Hero */}
            <header className="relative overflow-hidden border-b border-white/10 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.15),transparent_70%)]" />
                <Container className="relative z-10 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link to="/">
                                <PizzaLogo className="h-10 w-auto" />
                            </Link>
                            <div className="h-6 w-px bg-white/10 hidden md:block" />
                            <div className="flex items-center gap-2">
                                <span className="bg-red-600/10 text-red-500 border border-red-600/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(220,38,38,0.2)]">
                                    Admin Console
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-white">{user?.fullName}</p>
                                <p className="text-xs text-gray-400 capitalize">{role}</p>
                            </div>
                            <Button variant="ghost" onClick={handleLogout} className="!p-2 text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-full transition-all">
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Navigation Tabs (pills) */}
                    <div className="flex items-center gap-1 mt-6 p-1 bg-white/5 rounded-xl border border-white/5 w-fit mx-auto md:mx-0 overflow-x-auto max-w-full">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                                    ${activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                `}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-red-600 rounded-lg shadow-lg shadow-red-900/50"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <tab.icon className="w-4 h-4" /> {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </Container>
            </header>

            <Container className="pt-8">


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
                                        <option value="all">All Statuses</option>
                                        {STATUS_CATEGORIES.map(category => (
                                            <optgroup key={category} label={category} className="bg-zinc-900 text-gray-400 font-bold uppercase text-[10px]">
                                                {Object.values(ORDER_STATUSES)
                                                    .filter(s => s.category === category)
                                                    .map(s => (
                                                        <option key={s.id} value={s.id} className="bg-zinc-900 text-white font-medium normal-case text-sm">
                                                            {s.emoji} {s.label}
                                                        </option>
                                                    ))}
                                            </optgroup>
                                        ))}
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
                                            {['Order ID', 'Customer', 'Items', 'Total', 'Priority', 'Status', canEditMenu && 'Actions'].filter(Boolean).map(h => (
                                                <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredOrders.length === 0 ? (
                                            <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No orders found</td></tr>
                                        ) : (
                                            filteredOrders.map(order => (
                                                <OrderRow key={order.id} order={order} onStatusChange={handleStatusChange} onDelete={() => setOrderToDelete(order.id)} canEdit={canEditMenu} />
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
                                {canEditMenu && (
                                    <Button variant="primary" onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                                        <Plus className="w-4 h-4" /> Add Item
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Menu Grid */}
                        {menuLoading ? (
                            <div className="text-center py-12 text-gray-500">Loading menu...</div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <AnimatePresence mode="popLayout">
                                    {filteredMenu.map(item => (
                                        <MenuItemCard
                                            key={item.id}
                                            item={item}
                                            onEdit={() => setEditingItem(item)}
                                            onToggle={() => handleToggleAvailability(item)}
                                            onDelete={() => setItemToDelete(item.id)}
                                            canEdit={canEditMenu}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'team' && canManageTeam && (
                    <TeamManagement />
                )}

                {activeTab === 'profile' && (
                    <ProfileSection />
                )}

                {/* Edit Modal */}
                {editingItem && canEditMenu && <EditItemModal item={editingItem} onClose={() => setEditingItem(null)} onSave={handleSaveEdit} />}

                {/* Add Modal */}
                {showAddForm && canEditMenu && <AddItemModal onClose={() => setShowAddForm(false)} onAdd={handleAddItem} />}

                {/* Delete Confirmations */}
                <ConfirmDialog isOpen={!!orderToDelete} onClose={() => setOrderToDelete(null)} onConfirm={handleDeleteOrder} title="Delete this order?" message="This action cannot be undone." confirmText="Delete" cancelText="Cancel" variant="danger" />
                <ConfirmDialog isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={handleDeleteItem} title="Delete this menu item?" message="This will remove the item from your menu." confirmText="Delete" cancelText="Cancel" variant="danger" />
            </Container>
        </div>
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
    const statusInfo = getStatusById(order.status);

    const statusColors = {
        blue: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        green: 'bg-green-500/20 text-green-400 border border-green-500/30',
        yellow: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
        orange: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
        red: 'bg-red-500/20 text-red-400 border border-red-500/30',
        emerald: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        purple: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
        zinc: 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30'
    };

    return (
        <motion.tr layout className="hover:bg-white/5 transition-colors">
            <td className="px-6 py-4"><span className="font-bold text-white">#{order.id}</span></td>
            <td className="px-6 py-4"><span className="text-gray-300">{order.customer || 'Guest'}</span></td>
            <td className="px-6 py-4"><span className="text-gray-400">{order.items?.length || 0} items</span></td>
            <td className="px-6 py-4"><span className="font-bold text-red-500">{formatCurrency(order.totalPrice)}</span></td>
            <td className="px-6 py-4">{order.priority ? <span className="flex items-center gap-1 text-orange-400 text-xs font-bold"><Zap className="w-3 h-3" /> Yes</span> : <span className="text-gray-500 text-xs">No</span>}</td>
            <td className="px-6 py-4">
                <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value)}
                    className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg cursor-pointer ${statusColors[statusInfo.color]} focus:outline-none focus:ring-2 focus:ring-red-600 transition-all`}
                >
                    {STATUS_CATEGORIES.map(category => (
                        <optgroup key={category} label={category} className="bg-zinc-900 text-gray-500 font-black uppercase text-[10px] py-2">
                            {Object.values(ORDER_STATUSES)
                                .filter(s => s.category === category)
                                .map(s => (
                                    <option key={s.id} value={s.id} className="bg-zinc-900 text-white font-bold normal-case text-sm">
                                        {s.emoji} {s.label}
                                    </option>
                                ))}
                        </optgroup>
                    ))}
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
    const [formData, setFormData] = useState({ ...item, price: item.unitPrice || item.price, imageFile: null });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            setFormData({ ...formData, imageFile: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description || '');
        data.append('unitPrice', parseFloat(formData.price)); // Backend expects unitPrice
        data.append('category', formData.category);
        data.append('available', formData.available);
        data.append('bestseller', formData.bestseller || false);
        data.append('featured', formData.featured || false);
        data.append('isDailySpecial', formData.isDailySpecial || false);
        data.append('discount', formData.discount || 0);
        data.append('spicy', formData.spicy || false);
        data.append('vegetarian', formData.vegetarian || false);

        // Only append image if a new file was selected. 
        // If not, the backend will keep the existing URL if we don't send anything, or we can send the URL as a backup.
        // Current backend logic: checks req.file first, then req.body.imageUrl.
        if (formData.imageFile) {
            data.append('image', formData.imageFile);
        } else {
            data.append('imageUrl', formData.image || '');
        }

        await onSave({ ...formData, id: item.id }, data); // Pass prepared FormData as second arg if needed, or just let onSave handle it
        setIsSaving(false);
    };

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

                    <div>
                        <label className="text-sm font-bold text-gray-400 block mb-1">Image</label>
                        <input type="file" name="image" onChange={handleChange} accept="image/*" className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer" />
                        {formData.image && !formData.imageFile && <p className="text-xs text-gray-500 mt-2">Current: {formData.image}</p>}
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="available" checked={formData.available} onChange={handleChange} className="accent-red-600" /><span className="text-gray-300">Available</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="bestseller" checked={formData.bestseller || false} onChange={handleChange} className="accent-yellow-500" /><span className="text-gray-300">Bestseller</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="featured" checked={formData.featured || false} onChange={handleChange} className="accent-blue-500" /><span className="text-gray-300">Featured (Samurai Choice)</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isDailySpecial" checked={formData.isDailySpecial || false} onChange={handleChange} className="accent-rose-500" /><span className="text-gray-300">Daily Special</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="spicy" checked={formData.spicy || false} onChange={handleChange} className="accent-orange-500" /><span className="text-gray-300">Spicy</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="vegetarian" checked={formData.vegetarian || false} onChange={handleChange} className="accent-green-500" /><span className="text-gray-300">Vegetarian</span></label>
                    </div>
                    {formData.isDailySpecial && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                            <label className="text-sm font-bold text-gray-400 block mb-1">Discount Percentage (%)</label>
                            <input name="discount" type="number" min="0" max="100" value={formData.discount || ''} onChange={handleChange} placeholder="e.g. 20" className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white" />
                        </motion.div>
                    )}
                </div>
                <div className="flex gap-3 p-6 border-t border-white/10">
                    <Button variant="secondary" onClick={onClose} className="flex-1 !bg-zinc-800 !border-white/10" disabled={isSaving}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave} className="flex-1 flex items-center justify-center gap-2" disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

function AddItemModal({ onClose, onAdd }) {
    const [formData, setFormData] = useState({ name: '', description: '', price: '', category: 'pizza', available: true, bestseller: false, featured: false, isDailySpecial: false, discount: 0, spicy: false, vegetarian: false, imageFile: null });

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            setFormData({ ...formData, imageFile: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
        }
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.price) { toast.error('Name and price required'); return; }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('unitPrice', parseFloat(formData.price)); // Backend expects unitPrice
        data.append('category', formData.category);
        data.append('available', formData.available);
        data.append('bestseller', formData.bestseller);
        data.append('featured', formData.featured);
        data.append('isDailySpecial', formData.isDailySpecial);
        data.append('discount', formData.discount);
        data.append('spicy', formData.spicy);
        data.append('vegetarian', formData.vegetarian);

        if (formData.imageFile) {
            data.append('image', formData.imageFile);
        }

        onAdd(data);
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

                    <div>
                        <label className="text-sm font-bold text-gray-400 block mb-1">Image</label>
                        <input type="file" name="image" onChange={handleChange} accept="image/*" className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer" />
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="bestseller" checked={formData.bestseller} onChange={handleChange} className="accent-yellow-500" /><span className="text-gray-300">Bestseller</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="accent-blue-500" /><span className="text-gray-300">Featured</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isDailySpecial" checked={formData.isDailySpecial} onChange={handleChange} className="accent-rose-500" /><span className="text-gray-300">Daily Special</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="spicy" checked={formData.spicy} onChange={handleChange} className="accent-orange-500" /><span className="text-gray-300">Spicy</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="vegetarian" checked={formData.vegetarian} onChange={handleChange} className="accent-green-500" /><span className="text-gray-300">Vegetarian</span></label>
                    </div>
                    {formData.isDailySpecial && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                            <label className="text-sm font-bold text-gray-400 block mb-1">Discount Percentage (%)</label>
                            <input name="discount" type="number" min="0" max="100" value={formData.discount || ''} onChange={handleChange} placeholder="e.g. 20" className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500" />
                        </motion.div>
                    )}
                </div>
                <div className="flex gap-3 p-6 border-t border-white/10">
                    <Button variant="secondary" onClick={onClose} className="flex-1 !bg-zinc-800 !border-white/10">Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Item</Button>
                </div>
            </motion.div>
        </div>
    );
}


function ProfileSection() {
    const currentUser = useSelector(state => state.admin.user);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: currentUser?.fullName || currentUser?.full_name || '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsSaving(true);
        try {
            const updateData = { fullName: formData.fullName };
            if (formData.password) {
                updateData.password = formData.password;
            }
            await updateAdminUser(currentUser.id, updateData);
            toast.success('Profile updated successfully');
            setIsEditing(false);
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (err) {
            toast.error(err.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-zinc-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl">
                        {(currentUser?.fullName || currentUser?.full_name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white">{currentUser?.fullName || currentUser?.full_name}</h2>
                        <p className="text-gray-400">@{currentUser?.username}</p>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize mt-2 ${currentUser?.role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                currentUser?.role === 'manager' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                    'bg-green-500/10 text-green-400 border border-green-500/20'
                            }`}>
                            {currentUser?.role}
                        </span>
                    </div>
                </div>

                {!isEditing ? (
                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Full Name</p>
                                <p className="text-white font-medium">{currentUser?.fullName || currentUser?.full_name}</p>
                            </div>
                            <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Username</p>
                                <p className="text-white font-medium">{currentUser?.username}</p>
                            </div>
                            <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Role</p>
                                <p className="text-white font-medium capitalize">{currentUser?.role}</p>
                            </div>
                            <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Password</p>
                                <p className="text-gray-400">••••••••</p>
                            </div>
                        </div>
                        <Button variant="primary" onClick={() => setIsEditing(true)} className="mt-4 flex items-center gap-2">
                            <Edit2 className="w-4 h-4" /> Edit Profile
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-1">Username</label>
                            <input
                                type="text"
                                value={currentUser?.username}
                                disabled
                                className="w-full bg-zinc-800/50 border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-600 mt-1">Username cannot be changed</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-1">New Password (Optional)</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Leave blank to keep unchanged"
                                    className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        {formData.password && (
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-1">Confirm Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                />
                            </div>
                        )}
                        <div className="flex gap-3 pt-4">
                            <Button variant="secondary" onClick={() => setIsEditing(false)} className="flex-1 !bg-zinc-800 !border-white/10">
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSave} disabled={isSaving} className="flex-1">
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


function TeamManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null); // { type: 'block'|'unblock'|'delete', user: {...} }

    const currentUser = useSelector(state => state.admin.user);
    const canManage = currentUser?.role === 'admin';

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await getAdmins();
            setUsers(data);
        } catch (err) {
            toast.error('Failed to load team members');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (formData) => {
        try {
            await createAdminUser(formData.fullName, formData.username, formData.password, formData.role);
            toast.success(`User ${formData.fullName} created`);
            setShowAddModal(false);
            loadUsers();
        } catch (err) {
            toast.error(err.message || 'Failed to create user');
        }
    };

    const handleUpdateUser = async (formData) => {
        try {
            await updateAdminUser(editingUser.id, formData);
            toast.success('User updated successfully');
            setEditingUser(null);
            loadUsers();
        } catch (err) {
            toast.error(err.message || 'Failed to update user');
        }
    };

    const handleBlockToggle = async (user) => {
        const isBlocked = user.role === 'blocked';
        setConfirmAction({
            type: isBlocked ? 'unblock' : 'block',
            user,
            title: isBlocked ? 'Unblock User?' : 'Block User?',
            message: isBlocked
                ? `${user.full_name || user.fullName} will be able to login again.`
                : `${user.full_name || user.fullName} will no longer be able to login.`,
            confirmText: isBlocked ? 'Unblock' : 'Block',
            variant: isBlocked ? 'info' : 'danger'
        });
    };

    const handleDeleteUser = async (user) => {
        setConfirmAction({
            type: 'delete',
            user,
            title: 'Delete User?',
            message: `This will permanently remove ${user.full_name || user.fullName}'s account. This cannot be undone.`,
            confirmText: 'Delete',
            variant: 'danger'
        });
    };

    const executeConfirmAction = async () => {
        if (!confirmAction) return;
        const { type, user } = confirmAction;

        try {
            if (type === 'block') {
                await updateAdminUser(user.id, { role: 'blocked' });
                toast.success('User blocked successfully');
            } else if (type === 'unblock') {
                await updateAdminUser(user.id, { role: 'staff' });
                toast.success('User unblocked successfully');
            } else if (type === 'delete') {
                await deleteAdminUser(user.id);
                toast.success('User deleted successfully');
                setEditingUser(null);
            }
            loadUsers();
        } catch (err) {
            toast.error(err.message || `Failed to ${type} user`);
        }
        setConfirmAction(null);
    };



    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div>
                    <h2 className="text-2xl font-black text-white">Team Management</h2>
                    <p className="text-gray-400">View and manage your team/admins.</p>
                </div>
                {canManage && (
                    <Button variant="primary" onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Member
                    </Button>
                )}
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading team...</div>
            ) : (
                <div className="overflow-hidden bg-zinc-900/50 rounded-2xl border border-white/10">
                    <table className="w-full">
                        <thead className="bg-zinc-800/50 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</th>
                                {canManage && <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-white font-medium">{user.full_name || user.fullName}</td>
                                    <td className="px-6 py-4 text-gray-400">{user.username}</td>
                                    <td className="px-6 py-4">
                                        <Tooltip text={ROLE_DESCRIPTIONS[user.role] || 'Unknown role'} position="top">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize cursor-help ${user.role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                user.role === 'manager' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                    user.role === 'blocked' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20 line-through' :
                                                        'bg-green-500/10 text-green-400 border border-green-500/20'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </Tooltip>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        {new Date(user.created_at || user.createdAt).toLocaleDateString()}
                                    </td>
                                    {canManage && (
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            {/* Hide block/delete for the currently logged-in admin */}
                                            {user.id !== currentUser?.id && (
                                                <>
                                                    <Tooltip text={user.role === 'blocked' ? 'Unblock User' : 'Block User'} position="top">
                                                        <Button variant="ghost" onClick={() => handleBlockToggle(user)} className={`!p-2 rounded-lg ${user.role === 'blocked' ? 'text-green-500 hover:bg-green-500/10' : 'text-orange-500 hover:bg-orange-500/10'}`}>
                                                            {user.role === 'blocked' ? <CheckCircle className="w-4 h-4" /> : <LogOut className="w-4 h-4" />}
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip text="Delete User" position="top">
                                                        <Button variant="ghost" onClick={() => handleDeleteUser(user)} className="!p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </Tooltip>
                                                </>
                                            )}
                                            <Tooltip text="Edit User" position="top">
                                                <Button variant="ghost" onClick={() => setEditingUser(user)} className="!p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                            </Tooltip>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div >
            )
            }

            {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} onSave={handleCreateUser} />}
            {editingUser && <EditUserModal user={editingUser} currentUserId={currentUser?.id} onClose={() => setEditingUser(null)} onSave={handleUpdateUser} onDelete={() => handleDeleteUser(editingUser)} />}

            <ConfirmDialog
                isOpen={!!confirmAction}
                onClose={() => setConfirmAction(null)}
                onConfirm={executeConfirmAction}
                title={confirmAction?.title}
                message={confirmAction?.message}
                confirmText={confirmAction?.confirmText}
                variant={confirmAction?.variant}
            />
        </div >
    );
}

function EditUserModal({ user, currentUserId, onClose, onSave, onDelete }) {
    const isSelf = user.id === currentUserId;
    const [formData, setFormData] = useState({
        fullName: user.full_name || user.fullName,
        username: user.username,
        role: user.role,
        password: '' // Optional, only if changing
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        // Only send fields that are computed/changed. Ideally backend handles partials.
        await onSave(formData);
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Edit Team Member</h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4" autoComplete="off">
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                            disabled={isSelf}
                            className={`w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 ${isSelf ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <option value="staff">Staff — Orders only</option>
                            <option value="manager">Manager — Menu + Orders</option>
                            <option value="admin">Admin — Full access</option>
                            <option value="blocked">Blocked — No access</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            {isSelf ? "You cannot change your own role" : ROLE_DESCRIPTIONS[formData.role]}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            disabled
                            className="w-full bg-zinc-800/50 border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-600 mt-1">Username cannot be changed</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-1">New Password (Optional)</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 pr-10"
                                placeholder="Leave blank to keep unchanged"
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                        {!isSelf && (
                            <Button type="button" variant="ghost" onClick={() => { if (confirm('Delete this user?')) onDelete(); }} className="flex-1 text-red-500 hover:bg-red-500/10 hover:text-red-400">Delete User</Button>
                        )}
                        <Button type="submit" variant="primary" className={isSelf ? 'w-full' : 'flex-[2]'} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

function AddUserModal({ onClose, onSave }) {
    const [formData, setFormData] = useState({ fullName: '', username: '', password: '', role: 'staff' });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Add Team Member</h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4" autoComplete="off">
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                            className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                        >
                            <option value="staff">Staff (Orders Only)</option>
                            <option value="manager">Manager (Menu + Orders)</option>
                            <option value="admin">Admin (Full Access)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            required
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                            className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                            placeholder="e.g. noureddine"
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 pr-10"
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <Button type="submit" variant="primary" className="w-full mt-4">Create User</Button>
                </form>
            </motion.div>
        </div>
    );
}

export default AdminDashboard;
