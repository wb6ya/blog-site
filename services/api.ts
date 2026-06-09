export interface Blog {
  _id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  image?: string;
  tags?: string[];
  views?: number;
  likes?: number;
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

export async function getPopularBlogs(limit: number = 3): Promise<Blog[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return [];
  
  try {
    const res = await fetch(`${apiUrl}/blog?sort=popular&limit=${limit}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (Array.isArray(data.blogs) ? data.blogs : []);
  } catch (e) {
    console.error("Error fetching popular blogs", e);
    return [];
  }
}

export async function getSitemapBlogs(): Promise<{ _id: string; updatedAt?: string; createdAt?: string }[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return [];
  try {
    const res = await fetch(`${apiUrl}/blog/sitemap`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("Error fetching sitemap blogs", e);
    return [];
  }
}

export async function getBlogStats(token: string): Promise<any> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl || !token) return null;
  try {
    const res = await fetch(`${apiUrl}/blog/stats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (e) {
    console.error("Error fetching stats", e);
    return null;
  }
}

export async function getComments(blogId: string): Promise<any[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return [];
  try {
    const res = await fetch(`${apiUrl}/blog/${blogId}/comments`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (e) {
    console.error("Error fetching comments", e);
    return [];
  }
}

export async function postComment(blogId: string, authorName: string, content: string): Promise<{success: boolean, comment?: any, error?: string}> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return { success: false, error: "API URL not found" };
  try {
    const res = await fetch(`${apiUrl}/blog/${blogId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorName, content })
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.message || "Failed to post comment" };
    return { success: true, comment: data.data };
  } catch (e) {
    console.error("Error posting comment", e);
    return { success: false, error: "Network error" };
  }
}

export async function deleteAdminComment(commentId: string, token: string): Promise<boolean> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl || !token) return false;
  try {
    const res = await fetch(`${apiUrl}/blog/comment/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.ok;
  } catch (e) {
    console.error("Error deleting comment", e);
    return false;
  }
}

export async function subscribeNewsletter(email: string): Promise<{success: boolean, message: string}> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return { success: false, message: "API URL not found" };
  try {
    const res = await fetch(`${apiUrl}/subscribers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    return { success: res.ok, message: data.message || "Failed to subscribe" };
  } catch (e) {
    console.error("Error subscribing", e);
    return { success: false, message: "Network error" };
  }
}

export async function getSubscribers(token: string): Promise<any[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl || !token) return [];
  try {
    const res = await fetch(`${apiUrl}/subscribers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (e) {
    console.error("Error fetching subscribers", e);
    return [];
  }
}

export async function deleteSubscriber(id: string, token: string): Promise<boolean> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl || !token) return false;
  try {
    const res = await fetch(`${apiUrl}/subscribers/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.ok;
  } catch (e) {
    console.error("Error deleting subscriber", e);
    return false;
  }
}

export async function getSystemTags(): Promise<string[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return [];
  try {
    const res = await fetch(`${apiUrl}/tags`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map(tag => typeof tag === 'string' ? tag : tag.name);
    }
    return [];
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

export async function recordView(id: string): Promise<boolean> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return false;
  try {
    const res = await fetch(`${apiUrl}/blog/${id}/view`, { method: "POST" });
    return res.ok;
  } catch (e) {
    console.error("Failed to record view", e);
    return false;
  }
}

export async function recordLike(id: string): Promise<{ success: boolean; likes?: number }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return { success: false };
  try {
    const res = await fetch(`${apiUrl}/blog/${id}/like`, { method: "POST" });
    if (!res.ok) return { success: false };
    const data = await res.json();
    return { success: true, likes: data.likes };
  } catch (e) {
    console.error("Failed to record like", e);
    return { success: false };
  }
}
