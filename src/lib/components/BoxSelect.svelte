<script lang="ts">
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let { choices, selected, disabled, onSelected } = $props();

  const select = (choice: any) => {
    if (disabled) {
      return;
    }
    onSelected(choice);
  };
</script>

{#each choices as choice}
  <button
    class={`
      header
      uppercase
      flex flex-col gap-4 items-center
      px-4 py-2 text-base text-white backdrop-blur

      outline outline-2  -outline-offset-2
      transition-all

      ${selected.name === choice.name ? 'bg-white/20 outline-white/60' : 'bg-slate-950/10 outline-white/30'}
      ${selected.name !== choice.name && !disabled ? 'hover:bg-white/10 hover:outline-white/30' : ''}
      `}
    {disabled}
    onclick={() => select(choice.value)}
  >
    <img src={choice.icon} alt={choice.name} class="w-8 h-8" />
    {choice.name}
  </button>
{/each}
