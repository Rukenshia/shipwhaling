<script lang="ts">
  let { children, variant = 'light', padding = undefined, uppercase = false, ...props } = $props();
</script>

<div
  class={`
      ${props['class']}
      header
      ${uppercase ? 'uppercase' : ''}
      flex flex-col gap-4 items-center
      ${padding !== undefined ? padding : 'px-8 py-4'}
      text-base text-white backdrop-blur

      ${variant === 'light' ? 'bg-white/10 backdrop-blur outline-white/60' : ''}
      ${variant === 'verylight' ? 'bg-white/10 backdrop-blur outline-white/10' : ''}
      ${variant === 'dark' ? 'bg-slate-950/30 outline-white/20' : ''}
      ${variant === 'subtle' ? 'bg-slate-950/20 backdrop-blur outline-slate-950/10' : ''}
      ${variant === 'error' ? 'bg-red-950/30 outline-red-500/20' : ''}

      outline outline-2 -outline-offset-2
      transition-all`}
>
  {@render children?.()}
</div>
