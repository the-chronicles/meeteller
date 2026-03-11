import Link from "next/link";

const products = [
  { title: "Web Dashboard", href: "/product/web", description: "Manage meetings, tasks, and summaries." },
  { title: "Desktop App", href: "/product/desktop", description: "Floating assistant on Mac & Windows." },
  { title: "Browser Extension", href: "/product/extension", description: "Works inside Google Meet, Zoom, Teams." },
  { title: "Mobile App", href: "/product/mobile", description: "Transcribe & summarize on the go." },
];

export const ProductCards = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center mb-12">
          The Mav4 Ecosystem
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="border p-6 rounded-xl hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg">{p.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{p.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
