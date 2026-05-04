import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrdersContext';
import { buildPayFastData, submitPayFastForm } from '../../lib/payfast';
import './CheckoutPage.css';

const formatZAR = (v: number) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(v);

const SA_PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
  'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape',
];

interface FormState {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; city: string; province: string; postalCode: string; country: string;
  billingSame: boolean;
  billingFirstName: string; billingLastName: string;
  billingAddress: string; billingCity: string; billingProvince: string;
  billingPostalCode: string; billingCountry: string;
  billingPhone: string; billingAltPhone: string;
}

function emptyForm(): FormState {
  return {
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', province: '', postalCode: '', country: 'South Africa',
    billingSame: true,
    billingFirstName: '', billingLastName: '',
    billingAddress: '', billingCity: '', billingProvince: '',
    billingPostalCode: '', billingCountry: 'South Africa',
    billingPhone: '', billingAltPhone: '',
  };
}

function Field({
  label, required, error, children,
}: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="checkout-field">
      <label className="checkout-label">{label}{required && ' *'}</label>
      {children}
      {error && <p className="checkout-error">{error}</p>}
    </div>
  );
}

export function CheckoutPage() {
  const { items, totalPrice, totalCount } = useCart();
  const { createOrder } = useOrders();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormState, value: string | boolean) =>
    setForm(f => ({ ...f, [field]: value }));

  const input = (field: keyof FormState, placeholder?: string, type = 'text') => (
    <input
      type={type}
      className={`checkout-input${errors[field] ? ' checkout-input--error' : ''}`}
      value={form[field] as string}
      onChange={e => set(field, e.target.value)}
      placeholder={placeholder}
    />
  );

  const provinceSelect = (field: keyof FormState) => (
    <select
      className={`checkout-input${errors[field] ? ' checkout-input--error' : ''}`}
      value={form[field] as string}
      onChange={e => set(field, e.target.value)}
    >
      <option value="">Select province…</option>
      {SA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
    </select>
  );

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <Link to="/shop" className="checkout-btn checkout-btn--primary">Continue Shopping</Link>
      </div>
    );
  }

  const shippingTotal = items.reduce((s, i) => s + i.product.shippingFee, 0);
  const grandTotal    = totalPrice + shippingTotal;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim())  e.firstName  = 'Required.';
    if (!form.lastName.trim())   e.lastName   = 'Required.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required.';
    if (!form.phone.trim())      e.phone      = 'Required.';
    if (!form.address.trim())    e.address    = 'Required.';
    if (!form.city.trim())       e.city       = 'Required.';
    if (!form.province)          e.province   = 'Required.';
    if (!form.postalCode.trim()) e.postalCode = 'Required.';

    if (!form.billingSame) {
      if (!form.billingFirstName.trim()) e.billingFirstName = 'Required.';
      if (!form.billingLastName.trim())  e.billingLastName  = 'Required.';
      if (!form.billingAddress.trim())   e.billingAddress   = 'Required.';
      if (!form.billingCity.trim())      e.billingCity      = 'Required.';
      if (!form.billingProvince)         e.billingProvince  = 'Required.';
      if (!form.billingPostalCode.trim()) e.billingPostalCode = 'Required.';
    }
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    const itemName = items.length === 1
      ? items[0].product.title
      : `AutoExtras Order (${totalCount} items)`;

    const { data, ref } = buildPayFastData(
      form.firstName, form.lastName, form.email, grandTotal, itemName,
    );

    try {
      await createOrder(
        {
          fullName:   `${form.firstName.trim()} ${form.lastName.trim()}`,
          email:      form.email.trim(),
          phone:      form.phone.trim(),
          address:    form.address.trim(),
          city:       form.city.trim(),
          province:   form.province,
          postalCode: form.postalCode.trim(),
        },
        {
          orderRef:            ref,
          totalAmount:         grandTotal,
          shippingFee:         shippingTotal,
          phone:               form.phone.trim(),
          deliveryAddress:     form.address.trim(),
          deliveryCity:        form.city.trim(),
          deliveryProvince:    form.province,
          deliveryPostalCode:  form.postalCode.trim(),
          deliveryCountry:     form.country,
          billingSame:         form.billingSame,
          billingFirstName:    form.billingSame ? form.firstName.trim() : form.billingFirstName.trim(),
          billingLastName:     form.billingSame ? form.lastName.trim()  : form.billingLastName.trim(),
          billingAddress:      form.billingSame ? form.address.trim()   : form.billingAddress.trim(),
          billingCity:         form.billingSame ? form.city.trim()      : form.billingCity.trim(),
          billingProvince:     form.billingSame ? form.province         : form.billingProvince,
          billingPostalCode:   form.billingSame ? form.postalCode.trim(): form.billingPostalCode.trim(),
          billingCountry:      form.billingSame ? form.country          : form.billingCountry,
          billingPhone:        form.billingPhone.trim(),
          billingAltPhone:     form.billingAltPhone.trim(),
          items: items.map(i => ({
            productId:    i.product.id,
            productTitle: i.product.title,
            quantity:     i.quantity,
            unitPrice:    i.product.discountPrice && i.product.discountPrice < i.product.basePrice
              ? i.product.discountPrice
              : i.product.basePrice,
          })),
        },
      );

      sessionStorage.setItem('pf_order_ref', ref);
      submitPayFastForm(data);
    } catch {
      setErrors({ submit: 'Could not save your order. Please try again.' });
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-page__inner">
        <h1 className="checkout-page__title">Checkout</h1>

        <div className="checkout-layout">

          {/* ── LEFT: Form ── */}
          <div className="checkout-details">
            <form onSubmit={handleSubmit} noValidate>

              {/* Contact */}
              <h2 className="checkout-section__title">Contact Information</h2>
              <div className="checkout-field-row">
                <Field label="First Name" required error={errors.firstName}>
                  {input('firstName', 'e.g. Portia')}
                </Field>
                <Field label="Last Name" required error={errors.lastName}>
                  {input('lastName', 'e.g. Matha')}
                </Field>
              </div>
              <div className="checkout-field-row">
                <Field label="Email Address" required error={errors.email}>
                  {input('email', 'you@example.com', 'email')}
                </Field>
                <Field label="Phone Number" required error={errors.phone}>
                  {input('phone', 'e.g. 071 234 5678', 'tel')}
                </Field>
              </div>

              {/* Delivery Address */}
              <h2 className="checkout-section__title" style={{ marginTop: '1.5rem' }}>Delivery Address</h2>
              <Field label="Street Address" required error={errors.address}>
                {input('address', 'e.g. 12 Oak Avenue')}
              </Field>
              <div className="checkout-field-row">
                <Field label="City / Town" required error={errors.city}>
                  {input('city', 'e.g. Cape Town')}
                </Field>
                <Field label="Postal Code" required error={errors.postalCode}>
                  {input('postalCode', 'e.g. 8001')}
                </Field>
              </div>
              <div className="checkout-field-row">
                <Field label="Province" required error={errors.province}>
                  {provinceSelect('province')}
                </Field>
                <Field label="Country / Region">
                  {input('country')}
                </Field>
              </div>

              {/* Billing Address */}
              <h2 className="checkout-section__title" style={{ marginTop: '1.5rem' }}>Billing Address</h2>
              <div className="checkout-radio-group">
                <label className="checkout-radio">
                  <input
                    type="radio" name="billing"
                    checked={form.billingSame}
                    onChange={() => set('billingSame', true)}
                  />
                  Same as delivery address
                </label>
                <label className="checkout-radio">
                  <input
                    type="radio" name="billing"
                    checked={!form.billingSame}
                    onChange={() => set('billingSame', false)}
                  />
                  Use a different billing address
                </label>
              </div>

              {!form.billingSame && (
                <div className="checkout-billing-fields">
                  <div className="checkout-field-row">
                    <Field label="First Name" required error={errors.billingFirstName}>
                      <input
                        className={`checkout-input${errors.billingFirstName ? ' checkout-input--error' : ''}`}
                        value={form.billingFirstName}
                        onChange={e => set('billingFirstName', e.target.value)}
                        placeholder="Billing first name"
                      />
                    </Field>
                    <Field label="Surname" required error={errors.billingLastName}>
                      <input
                        className={`checkout-input${errors.billingLastName ? ' checkout-input--error' : ''}`}
                        value={form.billingLastName}
                        onChange={e => set('billingLastName', e.target.value)}
                        placeholder="Billing surname"
                      />
                    </Field>
                  </div>
                  <Field label="Street Address" required error={errors.billingAddress}>
                    <input
                      className={`checkout-input${errors.billingAddress ? ' checkout-input--error' : ''}`}
                      value={form.billingAddress}
                      onChange={e => set('billingAddress', e.target.value)}
                      placeholder="Billing street address"
                    />
                  </Field>
                  <div className="checkout-field-row">
                    <Field label="City / Town" required error={errors.billingCity}>
                      <input
                        className={`checkout-input${errors.billingCity ? ' checkout-input--error' : ''}`}
                        value={form.billingCity}
                        onChange={e => set('billingCity', e.target.value)}
                        placeholder="e.g. Johannesburg"
                      />
                    </Field>
                    <Field label="Postal Code" required error={errors.billingPostalCode}>
                      <input
                        className={`checkout-input${errors.billingPostalCode ? ' checkout-input--error' : ''}`}
                        value={form.billingPostalCode}
                        onChange={e => set('billingPostalCode', e.target.value)}
                        placeholder="e.g. 2000"
                      />
                    </Field>
                  </div>
                  <div className="checkout-field-row">
                    <Field label="Province" required error={errors.billingProvince}>
                      <select
                        className={`checkout-input${errors.billingProvince ? ' checkout-input--error' : ''}`}
                        value={form.billingProvince}
                        onChange={e => set('billingProvince', e.target.value)}
                      >
                        <option value="">Select province…</option>
                        {SA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </Field>
                    <Field label="Country / Region">
                      <input
                        className="checkout-input"
                        value={form.billingCountry}
                        onChange={e => set('billingCountry', e.target.value)}
                      />
                    </Field>
                  </div>
                  <Field label="Additional Details / Notes">
                    <input
                      className="checkout-input"
                      value={form.billingAltPhone}
                      onChange={e => set('billingAltPhone', e.target.value)}
                      placeholder="Alternative contact number for delivery"
                    />
                  </Field>
                  <Field label="Billing Phone Number">
                    <input
                      className="checkout-input"
                      value={form.billingPhone}
                      onChange={e => set('billingPhone', e.target.value)}
                      placeholder="Billing contact number"
                      type="tel"
                    />
                  </Field>
                </div>
              )}

              {errors.submit && <p className="checkout-error checkout-error--block">{errors.submit}</p>}

              <div className="checkout-sandbox-note" style={{ marginTop: '1.5rem' }}>
                <strong>Sandbox mode</strong> — No real payment will be taken.
              </div>

              <button
                type="submit"
                className="checkout-btn checkout-btn--primary checkout-btn--full"
                disabled={loading}
              >
                {loading ? 'Saving & Redirecting…' : 'Pay with PayFast'}
              </button>

              <Link to="/cart" className="checkout-btn checkout-btn--ghost checkout-btn--full">
                ← Back to Cart
              </Link>
            </form>
          </div>

          {/* ── RIGHT: Order summary ── */}
          <div className="checkout-summary">
            <h2 className="checkout-section__title">Order Summary</h2>
            <ul className="checkout-items">
              {items.map(({ product, quantity }) => {
                const unitPrice = product.discountPrice && product.discountPrice < product.basePrice
                  ? product.discountPrice : product.basePrice;
                return (
                  <li key={product.id} className="checkout-item">
                    <img src={product.images[0]} alt={product.title} className="checkout-item__img" />
                    <div className="checkout-item__info">
                      <p className="checkout-item__title">{product.title}</p>
                      <p className="checkout-item__qty">Qty: {quantity}</p>
                    </div>
                    <span className="checkout-item__price">{formatZAR(unitPrice * quantity)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="checkout-totals">
              <div className="checkout-total-row">
                <span>Subtotal</span><span>{formatZAR(totalPrice)}</span>
              </div>
              <div className="checkout-total-row">
                <span>Shipping</span><span>{formatZAR(shippingTotal)}</span>
              </div>
              <div className="checkout-total-row checkout-total-row--grand">
                <span>Total</span><span>{formatZAR(grandTotal)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
