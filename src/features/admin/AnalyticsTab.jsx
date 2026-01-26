import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, ShoppingBag, Calendar, Award, Download } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

function AnalyticsTab({ stats }) {
    if (!stats) return <div className="text-center text-gray-500 py-12">Loading analytics...</div>;

    const { financials, graph, topItems } = stats;

    const exportCSV = () => {
        const headers = ["Date", "Revenue"];
        const rows = graph.map(d => [d.date, d.value]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "daily_revenue.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-white">Financial Overview</h2>
                    <p className="text-gray-400">Track your business growth and performance.</p>
                </div>
                <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all border border-white/10">
                    <Download className="w-4 h-4" /> Export Data
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Revenue (Today)" value={formatCurrency(financials.revenueToday)} subvalue={`${financials.ordersToday} orders`} icon={<DollarSign className="text-green-500" />} trend="+12%" color="green" />
                <KPICard title="Revenue (7 Days)" value={formatCurrency(financials.revenue7d)} subvalue={`${financials.orders7d} orders`} icon={<Calendar className="text-blue-500" />} trend="This Week" color="blue" />
                <KPICard title="Revenue (30 Days)" value={formatCurrency(financials.revenue30d)} subvalue={`${financials.orders30d} orders`} icon={<TrendingUp className="text-purple-500" />} trend="This Month" color="purple" />
                <KPICard title="Total Orders" value={financials.totalOrders} subvalue="Lifetime" icon={<ShoppingBag className="text-orange-500" />} trend="All Time" color="orange" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-red-500" /> Revenue Trend (Last 30 Days)
                    </h3>
                    <div className="h-64 flex items-end gap-2">
                        {graph.map((day, index) => {
                            const maxVal = Math.max(...graph.map(d => d.value)) || 1;
                            const heightPercentage = (day.value / maxVal) * 100;
                            return (
                                <div key={day.date} className="flex-1 flex flex-col justify-end group relative">
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-white/10">
                                        {day.date}: {formatCurrency(day.value)}
                                    </div>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${heightPercentage}%` }}
                                        transition={{ duration: 0.8, delay: index * 0.02, ease: "easeOut" }}
                                        className="w-full bg-gradient-to-t from-red-600/20 to-red-500 rounded-t-sm hover:from-red-500 hover:to-red-400 transition-colors"
                                    />
                                </div>
                            );
                        })}
                    </div>
                    {/* X-Axis Labels (simplified) */}
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>{graph[0]?.date}</span>
                        <span>{graph[Math.floor(graph.length / 2)]?.date}</span>
                        <span>{graph[graph.length - 1]?.date}</span>
                    </div>
                </div>

                {/* Top Items Leaderboard */}
                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-500" /> Best Sellers
                    </h3>
                    <div className="space-y-4">
                        {topItems.map((item, idx) => (
                            <div key={item.name} className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-xl border border-white/5 hover:bg-zinc-800 transition-colors">
                                <div className={`w-8 h-8 flex items-center justify-center font-black rounded-full ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-gray-400 text-black' : idx === 2 ? 'bg-orange-700 text-white' : 'bg-zinc-700 text-gray-400'}`}>
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-bold text-sm">{item.name}</p>
                                    <p className="text-gray-500 text-xs">{item.value} sold</p>
                                </div>
                                <div className="h-1.5 w-16 bg-zinc-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${(item.value / topItems[0].value) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                        {topItems.length === 0 && <p className="text-gray-500 text-center text-sm">No sales data yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({ title, value, subvalue, icon, trend, color }) {
    const bgColors = {
        green: 'bg-green-500/10 border-green-500/20',
        blue: 'bg-blue-500/10 border-blue-500/20',
        purple: 'bg-purple-500/10 border-purple-500/20',
        orange: 'bg-orange-500/10 border-orange-500/20'
    };

    return (
        <div className={`p-6 rounded-2xl border ${bgColors[color]} relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-xl text-white">{icon}</div>
                <span className="text-xs font-bold bg-white/5 px-2 py-1 rounded text-white">{trend}</span>
            </div>
            <h4 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">{title}</h4>
            <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-black text-white">{value}</h3>
                <span className="text-sm text-gray-500">{subvalue}</span>
            </div>
        </div>
    );
}

export default AnalyticsTab;
