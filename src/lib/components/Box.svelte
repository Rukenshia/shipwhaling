<script lang="ts">
  let props = $props();

  let { children, variant = 'light' } = props;
</script>

<div
  class={`
      ${props['class']}
      header
      uppercase
      flex flex-col gap-4 items-center
      px-8 py-4 text-base text-white backdrop-blur

      ${variant === 'light' ? 'bg-white/10 backdrop-blur outline-white/60' : ''}
      ${variant === 'dark' ? 'bg-slate-950/30 outline-white/20' : ''}
      ${variant === 'subtle' ? 'bg-slate-950/20 backdrop-blur outline-slate-950/10' : ''}

      outline outline-2 -outline-offset-2
      transition-all`}
>
  {@render children?.()}
</div>
