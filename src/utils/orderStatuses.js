/**
 * Order Status Flow Pattern
 * 
 * HAPPY PATH:
 * received → confirmed → preparing → ready → out_for_delivery/awaiting_pickup → delivered/picked_up
 * 
 * EXCEPTIONS (can happen at any stage):
 * delayed, cancelled, failed, refunded
 */

export const ORDER_STATUSES = {
    // ═══════════════════════════════════════════════════════════
    // 📥 STAGE 1: ORDER RECEIVED
    // ═══════════════════════════════════════════════════════════
    RECEIVED: {
        id: 'received',
        label: 'Order Received',
        emoji: '🧾',
        category: 'Active',
        color: 'blue',
        description: 'New order received, awaiting confirmation',
        step: 1,
        nextStatuses: ['confirmed', 'cancelled'],
    },

    // ═══════════════════════════════════════════════════════════
    // ✅ STAGE 2: CONFIRMED
    // ═══════════════════════════════════════════════════════════
    CONFIRMED: {
        id: 'confirmed',
        label: 'Confirmed',
        emoji: '✅',
        category: 'Active',
        color: 'green',
        description: 'Restaurant has accepted the order',
        step: 2,
        nextStatuses: ['preparing', 'cancelled'],
    },

    // ═══════════════════════════════════════════════════════════
    // 👨‍🍳 STAGE 3: PREPARING
    // ═══════════════════════════════════════════════════════════
    PREPARING: {
        id: 'preparing',
        label: 'Preparing',
        emoji: '👨‍🍳',
        category: 'Active',
        color: 'orange',
        description: 'Food is being prepared',
        step: 3,
        nextStatuses: ['ready', 'delayed', 'cancelled'],
    },

    // ═══════════════════════════════════════════════════════════
    // 📦 STAGE 4: READY
    // ═══════════════════════════════════════════════════════════
    READY: {
        id: 'ready',
        label: 'Ready',
        emoji: '📦',
        category: 'Active',
        color: 'emerald',
        description: 'Order is ready for pickup or delivery',
        step: 4,
        nextStatuses: ['out_for_delivery', 'awaiting_pickup', 'cancelled'],
    },

    // ═══════════════════════════════════════════════════════════
    // 🛵 STAGE 5A: OUT FOR DELIVERY
    // ═══════════════════════════════════════════════════════════
    OUT_FOR_DELIVERY: {
        id: 'out_for_delivery',
        label: 'Out for Delivery',
        emoji: '🛵',
        category: 'Active',
        color: 'blue',
        description: 'Courier is on the way with your order',
        step: 5,
        nextStatuses: ['delivered', 'failed'],
    },

    // ═══════════════════════════════════════════════════════════
    // 🛍️ STAGE 5B: AWAITING PICKUP
    // ═══════════════════════════════════════════════════════════
    AWAITING_PICKUP: {
        id: 'awaiting_pickup',
        label: 'Awaiting Pickup',
        emoji: '🛍️',
        category: 'Active',
        color: 'purple',
        description: 'Order is ready, waiting for customer to pick up',
        step: 5,
        nextStatuses: ['picked_up', 'cancelled'],
    },

    // ═══════════════════════════════════════════════════════════
    // ✅ STAGE 6: COMPLETED
    // ═══════════════════════════════════════════════════════════
    DELIVERED: {
        id: 'delivered',
        label: 'Delivered',
        emoji: '✅',
        category: 'Completed',
        color: 'emerald',
        description: 'Order successfully delivered',
        step: 6,
        nextStatuses: ['refunded'],
        isFinal: true,
    },
    PICKED_UP: {
        id: 'picked_up',
        label: 'Picked Up',
        emoji: '📦',
        category: 'Completed',
        color: 'emerald',
        description: 'Order collected by customer',
        step: 6,
        nextStatuses: ['refunded'],
        isFinal: true,
    },

    // ═══════════════════════════════════════════════════════════
    // ⚠️ EXCEPTIONS (can occur at various stages)
    // ═══════════════════════════════════════════════════════════
    DELAYED: {
        id: 'delayed',
        label: 'Delayed',
        emoji: '⏰',
        category: 'Exception',
        color: 'yellow',
        description: 'Order is taking longer than expected',
        nextStatuses: ['preparing', 'ready', 'cancelled'],
        isException: true,
    },
    CANCELLED: {
        id: 'cancelled',
        label: 'Cancelled',
        emoji: '❌',
        category: 'Exception',
        color: 'zinc',
        description: 'Order was cancelled',
        nextStatuses: ['refunded'],
        isFinal: true,
        isException: true,
    },
    FAILED: {
        id: 'failed',
        label: 'Failed',
        emoji: '⚠️',
        category: 'Exception',
        color: 'red',
        description: 'Delivery could not be completed',
        nextStatuses: ['out_for_delivery', 'refunded', 'cancelled'],
        isException: true,
    },
    REFUNDED: {
        id: 'refunded',
        label: 'Refunded',
        emoji: '💰',
        category: 'Exception',
        color: 'purple',
        description: 'Payment has been refunded',
        nextStatuses: [],
        isFinal: true,
        isException: true,
    },
};

// Categories for filtering/grouping
export const STATUS_CATEGORIES = ['Active', 'Completed', 'Exception'];

// Get status by ID
export function getStatusById(id) {
    return (
        Object.values(ORDER_STATUSES).find((s) => s.id === id) || {
            id,
            label: id,
            emoji: '📦',
            color: 'zinc',
            category: 'Unknown',
        }
    );
}

// Get valid next statuses for a given status
export function getNextStatuses(currentStatusId) {
    const status = getStatusById(currentStatusId);
    return (status.nextStatuses || []).map((id) => getStatusById(id));
}

// Status ID arrays for easy filtering
export const ACTIVE_STATUS_IDS = [
    'received',
    'confirmed',
    'preparing',
    'ready',
    'out_for_delivery',
    'awaiting_pickup',
    'delayed',
];

export const COMPLETED_STATUS_IDS = ['delivered', 'picked_up'];

export const EXCEPTION_STATUS_IDS = ['delayed', 'cancelled', 'failed', 'refunded'];

export const FINAL_STATUS_IDS = ['delivered', 'picked_up', 'cancelled', 'refunded'];

// Status flow for progress visualization
export const STATUS_FLOW = [
    { id: 'received', step: 1, label: 'Received' },
    { id: 'confirmed', step: 2, label: 'Confirmed' },
    { id: 'preparing', step: 3, label: 'Preparing' },
    { id: 'ready', step: 4, label: 'Ready' },
    { id: 'out_for_delivery', step: 5, label: 'Delivering' },
    { id: 'delivered', step: 6, label: 'Delivered' },
];

export const PICKUP_FLOW = [
    { id: 'received', step: 1, label: 'Received' },
    { id: 'confirmed', step: 2, label: 'Confirmed' },
    { id: 'preparing', step: 3, label: 'Preparing' },
    { id: 'ready', step: 4, label: 'Ready' },
    { id: 'awaiting_pickup', step: 5, label: 'Awaiting' },
    { id: 'picked_up', step: 6, label: 'Picked Up' },
];
