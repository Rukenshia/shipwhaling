<script lang="ts">
  import type { ItemDrop } from '$lib/container';

  let { drop }: { drop: ItemDrop } = $props();
</script>

<div
  data-drop-name={drop.name}
  class="drop group w-full sm:w-auto p-2 text-white text-sm flex header items-center justify-between bg-slate-800/30 outline outline-1 outline-slate-600/60 -outline-offset-2"
>
  <div>
    {drop.name}
  </div>
  <div class="text-gray-400 group-data-[drop-active=true]:text-white">
    {Math.trunc(drop.probability * 1000) / 10}%
  </div>
</div>
