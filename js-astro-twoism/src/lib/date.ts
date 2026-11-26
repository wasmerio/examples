const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' });

function formatDate(date: Date): string {
  return dateFormat.format(date);
}

export { formatDate };
