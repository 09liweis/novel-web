import { supabase } from "$lib/supabaseClient";

export async function load({ url }: { url: URL }) {
  const page = Number(url.searchParams.get('page')) || 1;
  const search = url.searchParams.get('search') || '';
  const category = url.searchParams.get('category') || '';
  const pageSize = 12;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = supabase
    .from('novels')
    .select('*', { count: 'exact' });

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  if (category) {
    query = query.eq('category', category);
  }

  const { data: novels, count, error } = await query
    .range(start, end)
    .order('created_at', { ascending: false });

  const { data: categories } = await supabase
    .from('novels')
    .select('category')
    .not('category', 'is', null);

  const uniqueCategories = [...new Set(categories?.map(item => item.category))];

  return {
    novels: novels || [],
    totalPages: Math.ceil((count || 0) / pageSize),
    currentPage: page,
    categories: uniqueCategories || [],
    search,
    selectedCategory: category
  };
}