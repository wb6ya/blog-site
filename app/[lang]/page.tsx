import type { Metadata } from 'next';
import Blogs from "../components/Blogs";
import Newsletter from "../components/Newsletter";
import { getDictionary } from "@/dictionaries";

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  return {
    title: lang === 'ar' ? 'الرئيسية' : 'Home',
  };
}

import { getBlogs, getSystemTags, getPopularBlogs } from "@/services/api";

export default async function Home(props: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams?.page as string || "1", 10);
  const search = searchParams?.search as string || "";
  const tag = searchParams?.tag as string || "";
  
  const { lang } = await props.params;
  const dict = await getDictionary(lang as "ar" | "en");
  
  const [blogsData, systemTags, popularBlogs] = await Promise.all([
    getBlogs(page, search, tag),
    getSystemTags(),
    getPopularBlogs(3)
  ]);
  
  const { blogs, currentPage, totalPages } = blogsData;
  
  return (
    <main className="min-h-screen pt-24 pb-24">
      <section className="container mx-auto px-4 max-w-7xl">
        <Blogs 
          blogs={blogs} 
          dict={dict.blogs} 
          heroDict={dict.hero}
          lang={lang} 
          currentPage={currentPage}
          totalPages={totalPages}
          currentSearch={search}
          currentTag={tag}
          systemTags={systemTags}
          popularBlogs={popularBlogs}
        />
      </section>
      <section className="px-4">
        <Newsletter lang={lang} />
      </section>
    </main>
  );
}
