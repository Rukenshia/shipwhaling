<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="bg-rose-800/60 rounded p-8 shadow-inner inset-0">
  {@render children?.()}
</div>
