import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import { breadcrumbSchema } from '@/lib/schemas';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaJsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about' },
      ])} />
      {children}
    </>
  );
}
