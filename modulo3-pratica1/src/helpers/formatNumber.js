const formatter = Intl.NumberFormat('pt-BR');

function formatNumber(value) {
  return formatter.format(value);
}

function returnPercentage(total, value) {
  const perc = ((value / total) * 100).toFixed(2);
  return isNaN(perc) ? '' : perc;
}

export { formatNumber, returnPercentage };
