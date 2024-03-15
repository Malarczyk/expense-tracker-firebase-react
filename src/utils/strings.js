const numberFormat = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' })
export const displayPrice = (price) => {
  const number = typeof price === 'string' ? Number(price) : price

  return numberFormat.format(number).replace(',', '.');
}