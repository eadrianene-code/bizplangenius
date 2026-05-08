/**
 * Server component that renders one or more JSON-LD schema objects.
 * Each schema gets its own <script> tag (Google prefers this over arrays).
 *
 * Usage:
 *   <SchemaJsonLd data={productSchema({...})} />
 *   <SchemaJsonLd data={[breadcrumbSchema([...]), faqSchema([...])]} />
 */

interface Props {
  data: object | object[];
}

export default function SchemaJsonLd({ data }: Props) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
