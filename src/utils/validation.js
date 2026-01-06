// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate full name
 */
export function isValidName(name) {
  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }

  // Check if contains only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(trimmedName)) {
    return { valid: false, error: 'Name can only contain letters and spaces' };
  }

  return { valid: true, error: null };
}

/**
 * Validate phone number
 */
export function isValidPhone(phone) {
  const trimmedPhone = phone.trim();

  if (trimmedPhone.length === 0) {
    return { valid: false, error: 'Phone number is required' };
  }

  // Remove all spaces, hyphens, and parentheses
  const cleanedPhone = trimmedPhone.replace(/[\s\-()]/g, '');

  // Check if it's a valid format (at least 10 digits, optional + at start)
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  if (!phoneRegex.test(cleanedPhone)) {
    return { valid: false, error: 'Please enter a valid phone number (10+ digits)' };
  }

  return { valid: true, error: null };
}

/**
 * Validate delivery address
 */
export function isValidAddress(address) {
  const trimmedAddress = address.trim();

  if (trimmedAddress.length < 10) {
    return { valid: false, error: 'Address must be at least 10 characters' };
  }

  return { valid: true, error: null };
}

/**
 * Validate entire order form
 */
export function validateOrderForm(formData) {
  const errors = {};

  const nameValidation = isValidName(formData.customer);
  if (!nameValidation.valid) {
    errors.customer = nameValidation.error;
  }

  const phoneValidation = isValidPhone(formData.phone);
  if (!phoneValidation.valid) {
    errors.phone = phoneValidation.error;
  }

  const addressValidation = isValidAddress(formData.address);
  if (!addressValidation.valid) {
    errors.address = addressValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================
// PRIORITY DELIVERY CALCULATIONS
// ============================================

/**
 * Calculate priority delivery fee
 */
export function calculatePriorityFee(orderPrice) {
  return orderPrice * 0.15;
}

/**
 * Calculate estimated delivery time
 * Normal: 30-40 minutes
 * Priority: 15-20 minutes
 */
export function calculateEstimatedDelivery(isPriority) {
  const now = new Date();

  // Add minutes based on priority
  const minutes = isPriority ? 15 : 30;
  now.setMinutes(now.getMinutes() + minutes);

  // Format as "HH:MM"
  const hours = now.getHours().toString().padStart(2, '0');
  const mins = now.getMinutes().toString().padStart(2, '0');

  return `${hours}:${mins}`;
}

/**
 * Calculate total order price including priority fee
 */
export function calculateTotalPrice(orderPrice, isPriority) {
  const priorityFee = isPriority ? calculatePriorityFee(orderPrice) : 0;
  return orderPrice + priorityFee;
}
