import { useState, useEffect } from 'react';
import { Form, useNavigation } from 'react-router-dom';
import { MapPin, Phone, User, Truck, Clock, FastForward } from 'lucide-react';
import Button from '../../ui/Button';

function CreateOrder() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [cart] = useState([
    { id: 1, name: 'Dragon Pepperoni', quantity: 2, price: 12 },
    { id: 2, name: 'Ronin Margherita', quantity: 1, price: 10 },
    { id: 3, name: 'Shogun BBQ', quantity: 3, price: 14 },
  ]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [estimatedDelivery, setEstimatedDelivery] = useState(null);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow overflow-hidden">
      <Form method="post" className="flex flex-col md:flex-row">
        {/* ================= LEFT SIDE: FORM ================= */}
        <div className="flex-1 p-8 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Create a New Order</h1>
          <p className="text-gray-600">Payment on delivery. Fast, precise, Samurai-approved.</p>

          <Field
            icon={<User />}
            label="Full name"
            inputType="text"
            placeholderText="John Samurai"
          />

          <Field
            icon={<Phone />}
            label="Phone number"
            inputType="tel"
            placeholderText="+212 6xx xxx xxx"
          />

          <Field
            icon={<MapPin />}
            label="Delivery address"
            inputType="text"
            placeholderText="Street, city, apartment"
          />
          <Field icon={<FastForward />} inputType="checkbox" label="Priority delivery " />

          <div className="flex w-[90%] justify-between">
            <div className="flex items-center gap-2 text-gray-900 font-medium mb-1">
              <Clock className="text-red-600" />
              Estimated Delivery
            </div>
            <div className="text-lg font-semibold text-red-700">
              {estimatedDelivery ? `${estimatedDelivery} mins` : 'Calculating...'}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-700">
            <Truck className="w-6 h-6" />
            <p className="text-sm font-medium">
              Payment is made <strong>in cash upon delivery</strong>.
            </p>
          </div>
        </div>

        {/* ================= VERTICAL SEPARATOR ================= */}
        <div className="border-l border-gray-300 hidden md:block" />

        {/* ================= RIGHT SIDE: CART ================= */}
        <div className="flex-1 p-8 bg-gray-50 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart</h2>

            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li key={item.id} className="py-3 flex justify-between text-gray-800">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${item.price * item.quantity}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-gray-300 flex justify-between font-bold text-lg text-gray-900">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              className="w-full md:w-auto text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing order...' : 'Place order'}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

/* ================= FIELD COMPONENT ================= */
function Field({ icon, label, inputType, placeholderText }) {
  return (
    <div
      className={`space-y-2 w-[90%] text-neutral-800 ${
        inputType === 'checkbox' ? 'flex items-center justify-between gap-3' : ''
      }`}
    >
      <label className="flex w-full items-center gap-2 font-medium text-gray-900">
        <span className="text-red-600">{icon}</span>
        {label}
      </label>
      <input
        className={`border border-gray-300 rounded-lg px-3 py-1.5 ${
          inputType === 'checkbox' ? '' : 'w-full'
        } focus:outline-none focus:ring-2 focus:ring-red-600`}
        type={inputType}
        placeholder={placeholderText}
      />
    </div>
  );
}

export default CreateOrder;
