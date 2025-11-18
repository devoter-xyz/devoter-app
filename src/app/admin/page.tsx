
import { AdminDashboard } from '@/components/pages/admin/AdminDashboard';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  );
}
