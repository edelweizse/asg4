export const calculateMetrics = (data, field) => {
  const values = data.map(d => d[field]);

  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((acc, d) => acc + d, 0) / values.length;
  const stdDev = Math.sqrt(values.reduce((acc, d) => acc + Math.pow(d - avg, 2), 0) / values.length);

  return { min, max, avg, stdDev };
}