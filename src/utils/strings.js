const numberFormat = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' })
export const displayPrice = (price) => {
  const number = typeof price === 'string' ? Number(price) : price

    // Formatuj liczbę, a następnie zamień przecinek na kropkę
  return numberFormat.format(number).replace(',', '.');
}