import Blogs from "./components/Blogs";

async function getBlogs() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/blog`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch blogs");
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function Home() {
  const blogs = await getBlogs();
  
  return (
    <main className="min-h-screen" dir="rtl">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Subtle Grid Background for Hero */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-[-1]"></div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-brand-light font-medium tracking-wide mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-light"></span>
          </span>
          نكتب لنُلهِم
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 max-w-4xl leading-tight drop-shadow-sm">
          أفكار وتجارب في <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand">عالم التقنية والتطوير</span>
        </h1>
        
        <p className="text-gray-400 max-w-2xl text-lg md:text-xl font-light leading-relaxed mb-12">
          مساحة أشارك فيها أفكاري وتجاربي في تطوير البرمجيات، التصميم، والتقنية بشكل عام. كل ما يخص صناعة الويب الحديث.
        </p>
      </section>

      {/* Blogs Section */}
      <section className="container mx-auto px-4 max-w-6xl pb-24">
        <Blogs blogs={blogs} />
      </section>
    </main>
  );
}
