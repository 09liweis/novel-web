<script lang="ts">
  import "../app.css";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap" rel="stylesheet">
  <meta name="viewport" content="width=1024">
</svelte:head>

<Header />
<main class="flex-grow mt-18">
  <slot />
</main>
<Footer />