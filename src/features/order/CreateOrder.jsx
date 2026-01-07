import { useState, useEffect } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MapPin, Phone, User, Truck, Clock, FastForward, AlertCircle } from 'lucide-react';
import Button from '../../ui/Button';
import { getCart, getTotalCartPrice } from '../../store/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import { createOrder } from '../../services/apiRestaurant';
import {
  validateOrderForm,
  isValidName,
  isValidPhone,
  isValidAddress,
  calculatePriorityFee,
  calculateEstimatedDelivery,
  calculateTotalPrice,
} from '../../utils/validation';
import EmptyCart from '../cart/EmptyCart';

function CreateOrder() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const formErrors = useActionData();

  const cart = useSelector(getCart);
  const orderPrice = useSelector(getTotalCartPrice);

  const [customer, setCustomer] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [priority, setPriority] = useState(false);

  // Local state for real-time validation errors
  const [errors, setErrors] = useState({});

  // Track which fields have been touched
  const [touched, setTouched] = useState({
    customer: false,
    phone: false,
    address: false,
  });

  const priorityFee = priority ? calculatePriorityFee(orderPrice) : 0;
  const totalPrice = calculateTotalPrice(orderPrice, priority);
  const estimatedDelivery = calculateEstimatedDelivery(priority);

  // Validate individual field on blur
  const handleBlur = (fieldName) => {
    setTouched({ ...touched, [fieldName]: true });

    let validation;
    switch (fieldName) {
      case 'customer':
        validation = isValidName(customer);
        break;
      case 'phone':
        validation = isValidPhone(phone);
        break;
      case 'address':
        validation = isValidAddress(address);
        break;
      default:
        return;
    }

    setErrors({
      ...errors,
      [fieldName]: validation.valid ? null : validation.error,
    });
  };

  const handleChange = (fieldName, value, setter) => {
    setter(value);

    if (touched[fieldName] && errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: null });
    }
  };

  if (cart.length === 0) return <EmptyCart />;

  const displayErrors = formErrors || errors;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow overflow-hidden">
      <Form method="POST" className="flex flex-col md:flex-row">
        {/* ================= LEFT SIDE: FORM ================= */}
        <div className="flex-1 p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create a New Order</h1>
            <p className="text-gray-600 mt-2">
              Payment on delivery. Fast, precise, Samurai-approved.
            </p>
          </div>

          {/* Full Name */}
          <Field
            icon={<User />}
            label="Full name"
            name="customer"
            inputType="text"
            placeholderText="John Samurai"
            value={customer}
            onChange={(e) => handleChange('customer', e.target.value, setCustomer)}
            onBlur={() => handleBlur('customer')}
            error={touched.customer && displayErrors?.customer}
            required
          />

          {/* Phone Number */}
          <Field
            icon={<Phone />}
            label="Phone number"
            name="phone"
            inputType="tel"
            placeholderText="+212 6xx xxx xxx"
            value={phone}
            onChange={(e) => handleChange('phone', e.target.value, setPhone)}
            onBlur={() => handleBlur('phone')}
            error={touched.phone && displayErrors?.phone}
            required
          />

          {/* Delivery Address */}
          <Field
            icon={<MapPin />}
            label="Delivery address"
            name="address"
            inputType="text"
            placeholderText="Street, city, apartment"
            value={address}
            onChange={(e) => handleChange('address', e.target.value, setAddress)}
            onBlur={() => handleBlur('address')}
            error={touched.address && displayErrors?.address}
            required
          />

          {/* Priority Delivery Checkbox */}
          <div className="space-y-2 w-[90%]">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="priority"
                checked={priority}
                onChange={(e) => setPriority(e.target.checked)}
                className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-2 focus:ring-red-600"
              />
              <span className="flex items-center gap-2 font-medium text-gray-900">
                <FastForward className="text-red-600 w-5 h-5" />
                Priority delivery
              </span>
            </label>

            {priority && (
              <p className="text-sm text-gray-600 ml-8">
                Get your order faster for an extra {formatCurrency(priorityFee)}
              </p>
            )}
          </div>

          {/* Estimated Delivery Time */}
          <div className="flex w-[90%] justify-between items-center bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-900 font-medium">
              <Clock className="text-red-600 w-5 h-5" />
              Estimated Delivery
            </div>
            <div className="text-lg font-semibold text-red-700">{estimatedDelivery}</div>
          </div>

          {/* Payment Info */}
          <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-700">
            <Truck className="w-6 h-6 flex-shrink-0" />
            <p className="text-sm font-medium">
              Payment is made <strong>in cash upon delivery</strong>.
            </p>
          </div>

          {/* Hidden input for cart data */}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
        </div>

        {/* ================= VERTICAL SEPARATOR ================= */}
        <div className="border-l border-gray-300 hidden md:block" />

        {/* ================= RIGHT SIDE: CART SUMMARY ================= */}
        <div className="flex-1 p-8 bg-gray-50 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>

            {/* Cart Items */}
            <ul className="divide-y divide-gray-200 mb-6">
              {cart.map((item) => (
                <li key={item.pizzaId} className="py-3 flex justify-between text-gray-800">
                  <span className="font-medium">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold">{formatCurrency(item.totalPrice)}</span>
                </li>
              ))}
            </ul>

            {/* Price Breakdown */}
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(orderPrice)}</span>
              </div>

              {priority && (
                <div className="flex justify-between text-red-700 font-medium">
                  <span>Priority fee (20%)</span>
                  <span>{formatCurrency(priorityFee)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-gray-300 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <Button
              type="submit"
              variant="primary"
              className="w-full text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing order...' : `Order now for ${formatCurrency(totalPrice)}`}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

// FORM FIELD COMPONENT

function Field({
  icon,
  label,
  name,
  inputType,
  placeholderText,
  value,
  onChange,
  onBlur,
  error,
  required = false,
}) {
  return (
    <div className="space-y-2 w-[90%] text-neutral-800">
      <label htmlFor={name} className="flex items-center gap-2 font-medium text-gray-900">
        <span className="text-red-600">{icon}</span>
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={inputType}
        placeholder={placeholderText}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition ${
          error ? 'border-red-500 focus:ring-red-600 error' : 'border-gray-300 focus:ring-red-600'
        }`}
      />

      {/* Error message with animation */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 animate-shake">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// FORM ACTION (handles form submission)

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // Validate form data
  const validation = validateOrderForm({
    customer: data.customer,
    phone: data.phone,
    address: data.address,
  });

  if (!validation.isValid) {
    return validation.errors;
  }

  const cart = JSON.parse(data.cart);

  const order = {
    customer: data.customer,
    phone: data.phone,
    address: data.address,
    priority: data.priority === 'on',
    cart,
  };

  try {
    const newOrder = await createOrder(order);

    return redirect(`/order/${newOrder.id}`);
  } catch (error) {
    // If API call fails, return error
    return {
      general: 'Failed to create order. Please try again.',
    };
  }
}

export default CreateOrder;
