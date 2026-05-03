import { Clock, Check, Loader, XCircle, Truck } from 'lucide-react'

const STATUS_CONFIG = {
  requested: { label: 'Requested', className: 'badge-warning', icon: Clock },
  accepted: { label: 'Accepted', className: 'badge-info', icon: Check },
  in_progress: { label: 'In Progress', className: 'badge-brand', icon: Truck },
  completed: { label: 'Completed', className: 'badge-success', icon: Check },
  cancelled: { label: 'Cancelled', className: 'badge-danger', icon: XCircle },
  available: { label: 'Available', className: 'badge-success', icon: Check },
  busy: { label: 'Busy', className: 'badge-warning', icon: Loader },
  offline: { label: 'Offline', className: 'badge-danger', icon: XCircle },
}

export default function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || { label: status, className: 'badge', icon: Clock }
  const Icon = config.icon
  return <span className={config.className}><Icon size={10} />{config.label}</span>
}
