<script lang="ts">
  export let title: string;
  export let value: number;
  export let icon: any | undefined = undefined;
</script>

<div
  class="bg-slate-950/50 backdrop-blur-sm rounded px-8 py-4 flex items-center text-center justify-around"
>
  <div class="leading-10 pb-4">
    <h1 class={`text-6xl text-white font-bold drop-shadow-2xl uppercase`}>
      <div class="flex items-center gap-2 justify-center">
        {value}
        {#if icon}
          <img src={icon} class="h-14" alt="currency icon" />
        {/if}
      </div>
    </h1>

    <h2 class={`text-cyan-50/80 drop-shadow-2xl leading-none flex-col gap-0`}>
      <div class="text-sm sm:text-base lg:text-lg leading-none">
        {title}
      </div>

      <div class="text-xs leading-6 :leading-none">
        <slot />
      </div>
    </h2>
  </div>
</div>
