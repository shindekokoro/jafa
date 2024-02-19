export default function convertDate(epochDate) {
  const date = new Date(+epochDate);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return date.toLocaleDateString('en-US', options);
}