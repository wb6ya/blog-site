import Blogs from "../components/Blogs";
import Hero from "../components/Hero";
import { getDictionary } from "@/dictionaries";

async function getBlogs(page: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/blog?page=${page}&limit=10`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch blogs");
    }
    const data = await res.json();
    
    // Support both old flat array API and new paginated object API
    const isFlatArray = Array.isArray(data);
    
    let blogsList = isFlatArray ? data : (Array.isArray(data.blogs) ? data.blogs : []);
    let currentTotalPages = 1;
    
    if (isFlatArray) {
      // Manual pagination fallback if API returns all items
      currentTotalPages = Math.ceil(blogsList.length / 10) || 1;
      const startIndex = (page - 1) * 10;
      blogsList = blogsList.slice(startIndex, startIndex + 10);
    } else {
      currentTotalPages = data.totalPages || 1;
    }

    return {
      blogs: blogsList,
      currentPage: isFlatArray ? page : (data.currentPage || 1),
      totalPages: currentTotalPages,
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { blogs: [], currentPage: 1, totalPages: 1 };
  }
}

export default async function Home(props: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams?.page as string || "1", 10);
  
  const { lang } = await props.params;
  const dict = await getDictionary(lang as "ar" | "en");
  
  const { blogs, currentPage, totalPages } = await getBlogs(page);
  
  return (
    <main className="min-h-screen">
      <Hero dict={dict.hero} />

      {/* Blogs Section */}
      <section className="container mx-auto px-4 max-w-6xl pb-24">
        <Blogs 
          blogs={blogs} 
          dict={dict.blogs} 
          lang={lang} 
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </section>
    </main>
  );
}
