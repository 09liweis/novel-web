<script lang="ts">
  import { WEBSITE_NAME } from '$lib/constants';
  import { supabase, getUserProfile, updateUserProfile } from '$lib/supabaseClient';
  import { getUserIp } from '$lib/helpers';
  import { goto } from '$app/navigation';
  import MembershipPlans from '$lib/components/MembershipPlans.svelte';
  import { user } from '$lib/stores/authStore';
  import { onMount } from "svelte";
  import Btn from '$lib/components/common/Btn.svelte';
  import ErrorMessage from '$lib/components/common/ErrorMessage.svelte';

  onMount(() => {
    if ($user) {
      return goto('/');
    }
  })

  let email = '';
  let password = '';
  let loading = false;
  let error: string | null = null;
  let showMembership = false;

  async function handleLogin() {
    try {
      loading = true;
      error = null;
      
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (loginError) throw loginError;

      // 获取用户资料并更新email和ip
      if (data.user) {
        const { data: profileData, error: profileError } = await getUserProfile(data.user.id);
        
        if (profileError) {
          console.error("获取用户资料失败:", profileError);
        } else if (profileData) {
          try {
            // 获取用户IP地址
            const userIp = await getUserIp();

            // 准备更新数据
            const updates: { email?: string; ip?: string } = { ip: userIp };
            if (!profileData.email) {
              updates.email = email;
            }

            // 更新用户资料
            const { error: updateError } = await updateUserProfile(data.user.id, updates);
          
            if (updateError) {
              console.error("更新用户资料失败:", updateError);
            } else {
              console.log("用户资料已更新");
            }
          } catch (error) {
            console.error("获取IP地址失败:", error.message);
          }
        }
      }

      if ($user?.profile?.role == 'author') {
        goto('/author/dashboard');
      } else {
        goto('/');
      }
    } catch (e: any) {
      error = e;
    } finally {
      loading = false;
    }
  }

  function handleMembershipClose() {
    showMembership = false;
    goto('/');
  }
</script>

<svelte:head>
  <title>登录 - {WEBSITE_NAME}</title>
</svelte:head>

{#if showMembership}
  <MembershipPlans onClose={handleMembershipClose} />
{/if}

<div class="min-h-screen  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/chinese-pattern.png')]">
  <div class="w-full max-w-md space-y-8">
    <div class="text-center">
      <h2 class=" text-4xl text-primary mb-2">
        {WEBSITE_NAME}
      </h2>
      <p class="text-lg text-red-700">登录您的账户</p>
    </div>
    
    {#if error}
      <ErrorMessage error={error} />
    {/if}
    
    <form class="mt-8 space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-lg border-2 border-gray-400 shadow-xl" on:submit|preventDefault={handleLogin}>
      <div class="space-y-4">
        <div>
          <label for="email-address" class="block text-sm font-medium text-gray-700">电子邮箱</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autocomplete="email"
            required
            bind:value={email}
            class="mt-1 block w-full rounded-md border-red-200 border-2 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 sm:text-sm transition duration-200"
            placeholder="请输入邮箱地址"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">密码</label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            bind:value={password}
            class="mt-1 block w-full rounded-md border-red-200 border-2 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 sm:text-sm transition duration-200"
            placeholder="请输入密码"
          />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="text-sm">
          <a href="/reset-password" class="font-medium text-red-600 hover:text-red-500 transition duration-200">
            忘记密码？
          </a>
        </div>
      </div>

      <Btn title={loading ? '登录中...' : '登录'} disabled={loading} type="submit" />
      
      <div class="text-sm text-center pt-4 border-t border-gray-400">
        <a href="/user/signup" class="font-medium text-red-600 hover:text-red-500 transition duration-200">
          还没有账户？立即注册
        </a>
      </div>
    </form>
  </div>
</div>