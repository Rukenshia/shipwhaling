<script lang="ts">
  interface Props {
    size?: string;
    align?: string;
    children?: import('svelte').Snippet;
    subtitle?: import('svelte').Snippet;
  }

  let {
    size = 'text-2xl',
    align = 'text-center',
    children,
    subtitle
  }: Props = $props();
</script>

<div class="leading-10 pb-4">
  <div class={`header ${align} ${size} text-white font-bold drop-shadow-2xl uppercase`}>
    {@render children?.()}
  </div>

  <div class={`header ${align} text-base sm:text-sm lg:text-lg text-cyan-50/80 drop-shadow-2xl`}>
    {@render subtitle?.()}
  </div>
</div>
