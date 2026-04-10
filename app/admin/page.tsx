import { Container } from '@/components/layout/Container';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';
import { requireAdminWorkspace } from '@/lib/auth-guard';

export default async function AdminPage() {
  await requireAdminWorkspace();

  return (
    <main className="min-h-screen bg-slate-950 py-16 text-slate-100">
      <Container>
        <AdminDashboardClient />
      </Container>
    </main>
  );
}
