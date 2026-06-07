import type { Metadata } from 'next';
import AdminNavbar from "@/app/components/AdminNavbar";

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  return {
    title: lang === 'ar' ? 'لوحة التحكم' : 'Admin Panel',
  };
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <AdminNavbar />
    </>
  );
}
