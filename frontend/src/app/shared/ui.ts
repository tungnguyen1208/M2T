export function formatVnd(value: number | null | undefined): string {
  return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value ?? 0)} đ`;
}

export function statusLabel(status: string): string {
  return (
    {
      Paid: 'Đã thanh toán',
      Processing: 'Đang xử lý',
      PendingPayment: 'Chờ thanh toán',
      Cancelled: 'Đã hủy',
    }[status] ?? status
  );
}

export function statusClass(status: string): string {
  return (
    {
      Paid: 'bg-emerald-100 text-emerald-700',
      Processing: 'bg-blue-100 text-blue-700',
      PendingPayment: 'bg-orange-100 text-orange-700',
      Cancelled: 'bg-rose-100 text-rose-700',
    }[status] ?? 'bg-slate-100 text-slate-700'
  );
}
