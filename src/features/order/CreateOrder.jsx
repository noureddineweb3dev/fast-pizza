import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MapPin, Phone, User, Truck, Clock, FastForward, AlertCircle, Locate, ShoppingBag, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../ui/Button';
import Container from '../../layout/Container';
import { getCart, getTotalCartPrice, getTotalCartQuantity } from '../../store/cartSlice';
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
import { getUserAddress } from '../../utils/geolocation';
import { getUser } from '../../store/userSlice';
import EmptyCart from '../cart/EmptyCart';

function CreateOrder() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const formErrors = useActionData();

  const cart = useSelector(getCart);
  const orderPrice = useSelector(getTotalCartPrice);
  const totalQuantity = useSelector(getTotalCartQuantity);
  const user = useSelector(getUser);

  const [customer, setCustomer] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [priority, setPriority] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({ customer: false, phone: false, address: false });

  const priorityFee = priority ? calculatePriorityFee(orderPrice) : 0;
  const totalPrice = calculateTotalPrice(orderPrice, priority);
  const estimatedDelivery = calculateEstimatedDelivery(priority);

  const handleBlur = (fieldName) => {
    setTouched({ ...touched, [fieldName]: true });
    let validation;
    switch (fieldName) {
      case 'customer': validation = isValidName(customer); break;
      case 'phone': validation = isValidPhone(phone); break;
      case 'address': validation = isValidAddress(address); break;
      default: return;
    }
    setErrors({ ...errors, [fieldName]: validation.valid ? null : validation.error });
  };

  const handleChange = (fieldName, value, setter) => {
    setter(value);
    if (touched[fieldName] && errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: null });
    }
  };

  const handleGetLocation = async () => {
    setIsGettingLocation(true);
    try {
      const result = await getUserAddress();
      if (result.success) {
        setAddress(result.address);
        setTouched({ ...touched, address: true });
        setErrors({ ...errors, address: null });
        toast.success('Location detected!', { id: 'location' });
      } else {
        toast.error(result.error, { id: 'location' });
      }
    } catch {
      toast.error('Failed to get location', { id: 'location' });
    } finally {
      setIsGettingLocation(false);
    }
  };

  if (cart.length === 0) return <EmptyCart />;

  const displayErrors = formErrors || errors;

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-black mb-12 border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.15),transparent_50%)]" />
        <Container className="relative z-10 py-16 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
            <div className="p-3 bg-red-600/20 rounded-2xl border border-red-500/30">
              <CreditCard className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white">Checkout</h1>
              <p className="text-gray-400 mt-1">{totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} • {formatCurrency(orderPrice)}</p>
            </div>
          </motion.div>
        </Container>
      </section>

      <Form method="POST">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 backdrop-blur-sm space-y-6">
              <h2 className="text-xl font-black text-white mb-4">Delivery Details</h2>

              <Field icon={<User />} label="Full Name" name="customer" inputType="text" placeholder="John Samurai" value={customer} onChange={(e) => handleChange('customer', e.target.value, setCustomer)} onBlur={() => handleBlur('customer')} error={touched.customer && displayErrors?.customer} required />

              <Field icon={<Phone />} label="Phone Number" name="phone" inputType="tel" placeholder="+212 6xx xxx xxx" value={phone} onChange={(e) => handleChange('phone', e.target.value, setPhone)} onBlur={() => handleBlur('phone')} error={touched.phone && displayErrors?.phone} required />

              <div className="space-y-2">
                <label htmlFor="address" className="flex items-center gap-2 text-sm font-bold text-gray-300">
                  <MapPin className="w-4 h-4 text-red-500" /> Delivery Address <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input id="address" name="address" type="text" placeholder="Street, city, apartment" value={address} onChange={(e) => handleChange('address', e.target.value, setAddress)} onBlur={() => handleBlur('address')} required className={`flex-1 bg-zinc-800 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition ${touched.address && displayErrors?.address ? 'border-red-500 focus:ring-red-600' : 'border-white/10 focus:ring-red-600'}`} />
                  <Button type="button" variant="secondary" onClick={handleGetLocation} disabled={isGettingLocation} className="!bg-zinc-800 !border-white/10 !px-4">
                    <Locate className={`w-5 h-5 text-gray-400 ${isGettingLocation ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                {touched.address && displayErrors?.address && (
                  <div className="flex items-center gap-2 text-sm text-red-500"><AlertCircle className="w-4 h-4" />{displayErrors.address}</div>
                )}
              </div>

              {/* Priority */}
              <div className="p-4 bg-zinc-800/50 rounded-xl border border-white/10">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="priority" checked={priority} onChange={(e) => setPriority(e.target.checked)} className="w-5 h-5 accent-red-600 rounded" />
                  <span className="flex items-center gap-2 font-bold text-white">
                    <FastForward className="w-5 h-5 text-orange-500" /> Priority Delivery
                  </span>
                </label>
                {priority && <p className="text-sm text-gray-400 ml-8 mt-2">Get your order faster for +{formatCurrency(priorityFee)}</p>}
              </div>

              {/* Delivery Estimate */}
              <div className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 text-gray-300"><Clock className="w-5 h-5 text-red-500" /> Estimated Delivery</div>
                <div className="text-lg font-black text-white">{estimatedDelivery}</div>
              </div>

              {/* Payment Info */}
              <div className="flex items-center gap-3 p-4 bg-green-900/20 rounded-xl border border-green-500/20">
                <Truck className="w-6 h-6 text-green-500" />
                <p className="text-sm text-green-400"><strong>Cash on Delivery</strong> — Pay when your order arrives.</p>
              </div>
            </motion.div>

            <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="sticky top-32 bg-zinc-900/50 rounded-[2rem] border border-white/10 p-6 backdrop-blur-sm">
              <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-red-500" /> Order Summary</h2>

              <ul className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <li key={item.pizzaId} className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded-xl">
                    {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.quantity} × {formatCurrency(item.unitPrice)}</p>
                    </div>
                    <p className="font-bold text-red-500 text-sm">{formatCurrency(item.totalPrice)}</p>
                  </li>
                ))}
              </ul>

              <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex justify-between text-gray-400"><span>Subtotal</span><span className="text-white">{formatCurrency(orderPrice)}</span></div>
                {priority && <div className="flex justify-between text-orange-400"><span>Priority Fee</span><span>{formatCurrency(priorityFee)}</span></div>}
                <div className="flex justify-between text-gray-400"><span>Delivery</span><span className="text-green-400">FREE</span></div>
                <div className="flex justify-between pt-3 border-t border-white/10"><span className="text-lg font-bold text-white">Total</span><span className="text-2xl font-black text-red-500">{formatCurrency(totalPrice)}</span></div>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full !rounded-xl !py-4 mt-6 text-lg" disabled={isSubmitting}>
                {isSubmitting ? 'Placing Order...' : `Pay ${formatCurrency(totalPrice)}`}
              </Button>
            </motion.div>
          </div>
        </div>
      </Form>
    </>
  );
}

function Field({ icon, label, name, inputType, placeholder, value, onChange, onBlur, error, required }) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="flex items-center gap-2 text-sm font-bold text-gray-300">
        <span className="text-red-500">{icon}</span> {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input id={name} name={name} type={inputType} placeholder={placeholder} value={value} onChange={onChange} onBlur={onBlur} required={required} className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition ${error ? 'border-red-500 focus:ring-red-600' : 'border-white/10 focus:ring-red-600'}`} />
      {error && <div className="flex items-center gap-2 text-sm text-red-500"><AlertCircle className="w-4 h-4" />{error}</div>}
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const validation = validateOrderForm({ customer: data.customer, phone: data.phone, address: data.address });
  if (!validation.isValid) return validation.errors;
  const cart = JSON.parse(data.cart);
  const orderPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const priority = data.priority === 'on';
  const priorityPrice = priority ? Math.round(orderPrice * 0.2) : 0; // Standard 20% priority fee

  const order = {
    customer: data.customer,
    phone: data.phone,
    address: data.address,
    priority,
    cart,
    orderPrice,
    priorityPrice,
    totalPrice: orderPrice + priorityPrice,
    estimatedDelivery: new Date(Date.now() + (priority ? 30 : 60) * 60000).toISOString()
  };

  try {
    const newOrder = await createOrder(order);
    return redirect(`/order/${newOrder.id}`);
  } catch {
    return { general: 'Failed to create order. Please try again.' };
  }
}

export default CreateOrder;
