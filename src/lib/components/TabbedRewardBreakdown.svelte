<script lang="ts">
  import RewardBreakdown from './RewardBreakdown.svelte';
  import Box from './Box.svelte';

  let { currentRewards, previouslyOwnedRewards } = $props();

  let activeTab = $state('current');

  function setActiveTab(tab: string) {
    activeTab = tab;
  }
</script>

<div class="space-y-4">
  <!-- Tab buttons -->
  <div class="flex bg-white/10 backdrop-blur outline outline-white/20">
    <button
      class="flex-1 py-2 px-4 text-sm font-medium transition-all duration-200 {activeTab ===
      'current'
        ? 'bg-white text-gray-800 shadow-sm'
        : 'text-gray-300 hover:text-white hover:bg-white/10'}"
      onclick={() => setActiveTab('current')}
    >
      Ships in Port
    </button>
    <button
      class="flex-1 py-2 px-4 text-sm font-medium transition-all duration-200 {activeTab ===
      'previously-owned'
        ? 'bg-white text-gray-800 shadow-sm'
        : 'text-gray-300 hover:text-white hover:bg-white/10'}"
      onclick={() => setActiveTab('previously-owned')}
    >
      Previously Owned Ships
    </button>
  </div>

  <!-- Tab content -->
  {#if activeTab === 'current'}
    <RewardBreakdown rewards={currentRewards} />
  {:else if activeTab === 'previously-owned'}
    <RewardBreakdown rewards={previouslyOwnedRewards} />
  {/if}
</div>
