import { getCategories, getNovels, supabase } from "$lib/supabaseClient";

export async function load({ url }: { url: URL }) {
  const page = Number(url.searchParams.get("page")) || 1;
  const search = url.searchParams.get("search") || "";
  const category = url.searchParams.get("category") || "";
  const status = url.searchParams.get("status") || "";
  const pageSize = 12;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const {
    data: novels,
    count,
    error,
  } = await getNovels({search, category, status, start, end});

  const {data:categories} = await getCategories();

  return {
    novels,
    totalPages: Math.ceil((count || 0) / pageSize),
    currentPage: page,
    categories: categories || [],
    search,
    selectedCategory: category,
    selectedStatus: status,
  };
}
