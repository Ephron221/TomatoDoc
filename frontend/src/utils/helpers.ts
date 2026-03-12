export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getFileExtension = (filename: string) => {
  return filename.split('.').pop();
};

export const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const getSeverityColor = (severity?: string) => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return 'bg-red-100 text-red-600 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-600 border-orange-200';
    case 'moderate':
      return 'bg-yellow-100 text-yellow-600 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-600 border-green-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};
