import md5 from 'md5';

export const PAYFAST = {
  merchantId: '10000100',
  merchantKey: '46f0cd694581a',
  passphrase: 'jt7NOE43FZPn',
  url: 'https://sandbox.payfast.co.za/eng/process',
};

export type PayFastData = Record<string, string>;

export function generateOrderRef(): string {
  return `AE${Date.now().toString().slice(-8)}`;
}

export function buildPayFastData(
  firstName: string,
  lastName: string,
  email: string,
  amount: number,
  itemName: string,
): { data: PayFastData; ref: string } {
  const ref = generateOrderRef();
  const baseUrl = window.location.origin;

  const data: PayFastData = {
    merchant_id:   PAYFAST.merchantId,
    merchant_key:  PAYFAST.merchantKey,
    return_url:    `${baseUrl}/checkout/success`,
    cancel_url:    `${baseUrl}/checkout/cancel`,
    notify_url:    `${baseUrl}/checkout/notify`,
    name_first:    firstName.trim(),
    name_last:     lastName.trim(),
    email_address: email.trim(),
    m_payment_id:  ref,
    amount:        amount.toFixed(2),
    item_name:     itemName.slice(0, 100),
  };

  // Build signature string — all params except merchant_key, in order
  const sigParams = Object.entries(data)
    .filter(([key]) => key !== 'merchant_key')
    .map(([key, val]) => `${key}=${encodeURIComponent(val.trim()).replace(/%20/g, '+')}`)
    .join('&');

  const sigString = PAYFAST.passphrase
    ? `${sigParams}&passphrase=${encodeURIComponent(PAYFAST.passphrase.trim()).replace(/%20/g, '+')}`
    : sigParams;

  data.signature = md5(sigString);

  return { data, ref };
}

export function submitPayFastForm(data: PayFastData): void {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = PAYFAST.url;

  Object.entries(data).forEach(([key, val]) => {
    const input = document.createElement('input');
    input.type  = 'hidden';
    input.name  = key;
    input.value = val;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}
