export const ORDER_STATUSES = {
    // 🧾 Order placed & confirmation
    PLACED: {
        id: 'placed',
        label: 'Order Placed',
        emoji: '🧾',
        category: 'Receipt',
        color: 'blue',
        description: 'Order placed & confirmation',
    },
    PENDING: {
        id: 'pending',
        label: 'Pending',
        emoji: '⏳',
        category: 'Receipt',
        color: 'yellow',
        description: 'Order received but not yet accepted',
    },
    CONFIRMED: {
        id: 'confirmed',
        label: 'Confirmed',
        emoji: '🤝',
        category: 'Receipt',
        color: 'green',
        description: 'Restaurant has accepted the order',
    },

    // 👩‍🍳 Preparation
    PREPARING: {
        id: 'preparing',
        label: 'Preparing',
        emoji: '👩‍🍳',
        category: 'Preparation',
        color: 'orange',
        description: 'Food is being cooked',
    },
    DELAYED: {
        id: 'delayed',
        label: 'Delayed',
        emoji: '⏰',
        category: 'Preparation',
        color: 'red',
        description: 'Preparation is taking longer than expected',
    },

    // 🚚 Delivery / Pickup
    READY_FOR_PICKUP: {
        id: 'ready_for_pickup',
        label: 'Ready for Pickup',
        emoji: '🛍️',
        category: 'Delivery',
        color: 'emerald',
        description: 'Food is ready to be picked up',
    },
    DELIVERING: {
        id: 'delivering',
        label: 'Out for Delivery',
        emoji: '🚚',
        category: 'Delivery',
        color: 'blue',
        description: 'Courier has the order and is on the way',
    },
    ARRIVED: {
        id: 'arrived',
        label: 'Arrived',
        emoji: '📍',
        category: 'Delivery',
        color: 'green',
        description: 'Courier has reached your location',
    },

    // ✅ Completion
    DELIVERED: {
        id: 'delivered',
        label: 'Delivered',
        emoji: '✅',
        category: 'Completion',
        color: 'emerald',
        description: 'Order handed over successfully',
    },
    PICKED_UP: {
        id: 'picked_up',
        label: 'Picked Up',
        emoji: '📦',
        category: 'Completion',
        color: 'emerald',
        description: 'Order collected by the customer',
    },

    // ❌ Problem / exception states
    CANCELLED: {
        id: 'cancelled',
        label: 'Cancelled',
        emoji: '❌',
        category: 'Exceptions',
        color: 'zinc',
        description: 'Order was cancelled',
    },
    FAILED: {
        id: 'failed',
        label: 'Failed',
        emoji: '⚠️',
        category: 'Exceptions',
        color: 'red',
        description: 'Delivery couldn’t be completed',
    },
    REFUNDED: {
        id: 'refunded',
        label: 'Refunded',
        emoji: '💰',
        category: 'Exceptions',
        color: 'purple',
        description: 'Payment was returned',
    },
    PARTIALLY_REFUNDED: {
        id: 'partially_refunded',
        label: 'Partially Refunded',
        emoji: '💸',
        category: 'Exceptions',
        color: 'purple',
        description: 'Only part of the order was refunded',
    },
};

export const STATUS_CATEGORIES = [
    'Receipt',
    'Preparation',
    'Delivery',
    'Completion',
    'Exceptions',
];

export function getStatusById(id) {
    return (
        Object.values(ORDER_STATUSES).find((s) => s.id === id) || {
            id,
            label: id,
            emoji: '📦',
            color: 'zinc',
        }
    );
}

export const ACTIVE_STATUS_IDS = [
    'placed',
    'pending',
    'confirmed',
    'preparing',
    'delayed',
    'ready_for_pickup',
    'delivering',
    'arrived',
];

export const COMPLETED_STATUS_IDS = ['delivered', 'picked_up'];
export const EXCEPTION_STATUS_IDS = [
    'cancelled',
    'failed',
    'refunded',
    'partially_refunded',
];
