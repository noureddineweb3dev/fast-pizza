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
                <KPICard
                    title="Revenue (Today)"
                    value={formatCurrency(financials.revenueToday)}
                    subvalue={`${financials.ordersToday} orders`}
                    icon={<DollarSign className="w-5 h-5" />}
                    badge="Today"
                    color="green"
                    highlight={financials.ordersToday > 0}
                />
                <KPICard
                    title="Revenue (7 Days)"
                    value={formatCurrency(financials.revenue7d)}
                    subvalue={`${financials.orders7d} orders`}
                    icon={<Calendar className="w-5 h-5" />}
                    badge="This Week"
                    color="blue"
                />
                <KPICard
                    title="Revenue (30 Days)"
                    value={formatCurrency(financials.revenue30d)}
                    subvalue={`${financials.orders30d} orders`}
                    icon={<TrendingUp className="w-5 h-5" />}
                    badge="This Month"
                    color="purple"
                />
                <KPICard
                    title="Total Revenue"
                    value={formatCurrency(financials.totalRevenue)}
                    subvalue={`${financials.totalOrders} orders`}
                    icon={<ShoppingBag className="w-5 h-5" />}
                    badge="All Time"
                    color="orange"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-red-500" /> Revenue Trend (Last 30 Days)
                    </h3>
                    {(!graph || graph.length === 0) ? (
                        <div className="h-64 flex items-center justify-center text-gray-500">
                            No revenue data available yet
                        </div>
                    ) : (() => {
                        const maxVal = Math.max(...graph.map(d => d.value)) || 1;
                        const totalRevenue = graph.reduce((sum, d) => sum + d.value, 0);
                        const avgRevenue = totalRevenue / graph.length;
                        const peakDay = graph.reduce((max, d) => d.value > max.value ? d : max, graph[0]);
                        const daysWithSales = graph.filter(d => d.value > 0).length;

                        // Format date helper (2026-01-15 -> Jan 15)
                        const formatDate = (dateStr) => {
                            if (!dateStr) return '';
                            const date = new Date(dateStr);
                            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        };

                        return (
                            <>
                                {/* Chart Summary Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-zinc-800/50 rounded-xl p-3 border border-white/5">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Total (30d)</p>
                                        <p className="text-xl font-black text-green-400">{formatCurrency(totalRevenue)}</p>
                                    </div>
                                    <div className="bg-zinc-800/50 rounded-xl p-3 border border-white/5">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Daily Average</p>
                                        <p className="text-xl font-black text-blue-400">{formatCurrency(avgRevenue)}</p>
                                    </div>
                                    <div className="bg-zinc-800/50 rounded-xl p-3 border border-white/5">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Peak Day</p>
                                        <p className="text-xl font-black text-yellow-400">{formatCurrency(peakDay.value)}</p>
                                        <p className="text-xs text-gray-500">{formatDate(peakDay.date)}</p>
                                    </div>
                                </div>

                                <div className="flex">
                                    {/* Y-Axis Labels */}
                                    <div className="flex flex-col justify-between text-xs text-gray-500 pr-2 h-56 py-1 min-w-[60px]">
                                        <span className="text-right font-mono">{formatCurrency(maxVal)}</span>
                                        <span className="text-right font-mono">{formatCurrency(maxVal * 0.5)}</span>
                                        <span className="text-right font-mono">$0</span>
                                    </div>

                                    {/* Chart Area */}
                                    <div className="flex-1">
                                        {/* Grid lines */}
                                        <div className="relative h-56 border-l border-b border-zinc-600 bg-zinc-800/20 rounded-tr-lg">
                                            {/* Horizontal grid lines */}
                                            <div className="absolute w-full h-px bg-zinc-600/30 top-0 border-dashed"></div>
                                            <div className="absolute w-full h-px bg-zinc-600/30 top-1/2 border-dashed"></div>

                                            {/* Bars */}
                                            <div className="absolute inset-0 flex items-end gap-px px-1 pb-px">
                                                {graph.map((day, index) => {
                                                    let heightPercent = (day.value / maxVal) * 100;
                                                    if (day.value > 0 && heightPercent < 3) heightPercent = 3;
                                                    const isPeak = day.date === peakDay.date && day.value > 0;

                                                    return (
                                                        <div key={day.date} className="flex-1 flex flex-col justify-end group relative h-full">
                                                            {/* Tooltip */}
                                                            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs px-4 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 pointer-events-none whitespace-nowrap z-20 border border-white/20 shadow-2xl">
                                                                <div className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Revenue</div>
                                                                <div className="font-black text-lg text-white">{formatCurrency(day.value)}</div>
                                                                <div className="text-gray-400 mt-1 flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" /> {formatDate(day.date)}
                                                                </div>
                                                                {isPeak && <div className="text-yellow-400 text-[10px] mt-1 font-bold">🏆 Peak Day</div>}
                                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 border-r border-b border-white/20 rotate-45"></div>
                                                            </div>
                                                            {/* Bar */}
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: day.value > 0 ? `${heightPercent}%` : '2px', opacity: 1 }}
                                                                transition={{ duration: 0.6, delay: index * 0.015, ease: "easeOut" }}
                                                                className={`w-full rounded-t transition-all cursor-pointer
                                                                    ${isPeak
                                                                        ? 'bg-gradient-to-t from-yellow-600 to-yellow-400 shadow-lg shadow-yellow-500/30'
                                                                        : day.value > 0
                                                                            ? 'bg-gradient-to-t from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 hover:shadow-lg hover:shadow-red-500/20'
                                                                            : 'bg-zinc-700/50'
                                                                    }`}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* X-Axis Labels */}
                                        <div className="flex justify-between mt-3 text-xs text-gray-500 px-1">
                                            <span className="font-medium text-gray-400">{formatDate(graph[0]?.date)}</span>
                                            <span>{formatDate(graph[Math.floor(graph.length / 2)]?.date)}</span>
                                            <span className="font-medium text-gray-400">{formatDate(graph[graph.length - 1]?.date)}</span>
                                        </div>

                                        {/* Legend */}
                                        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded bg-gradient-to-t from-red-700 to-red-500"></span>
                                                Daily Revenue
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded bg-gradient-to-t from-yellow-600 to-yellow-400"></span>
                                                Peak Day
                                            </span>
                                            <span className="text-gray-600">|</span>
                                            <span>{daysWithSales} active days</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        );
                    })()}
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

function KPICard({ title, value, subvalue, icon, badge, color, highlight }) {
    const colorStyles = {
        green: {
            bg: 'bg-gradient-to-br from-green-500/10 to-green-600/5',
            border: 'border-green-500/20',
            icon: 'bg-green-500/20 text-green-400',
            badge: 'bg-green-500/20 text-green-400',
            glow: highlight ? 'shadow-lg shadow-green-500/10' : ''
        },
        blue: {
            bg: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5',
            border: 'border-blue-500/20',
            icon: 'bg-blue-500/20 text-blue-400',
            badge: 'bg-blue-500/20 text-blue-400',
            glow: ''
        },
        purple: {
            bg: 'bg-gradient-to-br from-purple-500/10 to-purple-600/5',
            border: 'border-purple-500/20',
            icon: 'bg-purple-500/20 text-purple-400',
            badge: 'bg-purple-500/20 text-purple-400',
            glow: ''
        },
        orange: {
            bg: 'bg-gradient-to-br from-orange-500/10 to-orange-600/5',
            border: 'border-orange-500/20',
            icon: 'bg-orange-500/20 text-orange-400',
            badge: 'bg-orange-500/20 text-orange-400',
            glow: ''
        }
    };

    const styles = colorStyles[color] || colorStyles.blue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl border ${styles.bg} ${styles.border} ${styles.glow} relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}
        >
            {/* Background decoration */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/[0.02] group-hover:bg-white/[0.04] transition-colors"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl ${styles.icon}`}>{icon}</div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${styles.badge}`}>
                    {badge}
                </span>
            </div>

            <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">{title}</h4>

            <div className="relative z-10">
                <h3 className="text-2xl font-black text-white mb-1">{value}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                    {subvalue}
                </p>
            </div>
        </motion.div>
    );
}

export default AnalyticsTab;
