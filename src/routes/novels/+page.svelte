<script lang="ts">
  import { WEBSITE_NAME } from '$lib/constants';
  import { goto } from '$app/navigation';
    import NovelList from '$lib/components/novels/NovelList.svelte';
    import SearchFilters from '$lib/components/novels/SearchFilters.svelte';
    import Pagination from '$lib/components/novels/Pagination.svelte';
  
  export let data;
</script>

<svelte:head>
  <title>{WEBSITE_NAME} - 书库</title>
</svelte:head>

<div class="min-h-screen py-8 px-4">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-12">
      <h1 class=" text-5xl text-primary mb-4">墨香书库</h1>
      <p class="text-lg text-red-700">千卷书中自有黄金屋</p>
    </div>

    <SearchFilters data={data} />

    <NovelList novels={data.novels} />

    <Pagination data={data} />
  </div>
</div>