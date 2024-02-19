export default function formatAmount(amount, currency) {
  return amount.toLocaleString('en-US', {
    currency: currency,
    style: 'currency'
  });
}