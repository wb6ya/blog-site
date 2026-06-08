export interface Blog {
  _id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  image?: string;
  tags?: string[];
  createdAt: string;
  // add other fields as necessary
}

export interface PaginatedBlogs {
  blogs: Blog[];
  currentPage: number;
  totalPages: number;
}

export async function getBlogs(page: number, search: string, tag: string): Promise<PaginatedBlogs> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("NEXT_PUBLIC_API_URL is not defined");
    return { blogs: [], currentPage: 1, totalPages: 1 };
  }

  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', '10');
    if (search) params.append('search', search);
    if (tag) params.append('tag', tag);

    // Using ISR (revalidating every 60 seconds) instead of "no-store"
    const res = await fetch(`${apiUrl}/blog?${params.toString()}`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch blogs");
    }
    const data = await res.json();
    
    // Support both old flat array API and new paginated object API
    const isFlatArray = Array.isArray(data);
    
    let blogsList: Blog[] = isFlatArray ? data : (Array.isArray(data.blogs) ? data.blogs : []);
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
