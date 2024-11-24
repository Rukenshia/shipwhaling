<script lang="ts">
  import type { ItemDrop } from '$lib/container';

  let { drop }: { drop: ItemDrop } = $props();

  let chance = (() => {
    let v = Math.ceil(drop.probability * 100 * 10000) / 10000;

    // correct floating point errors (in a bad way)
    if (v - Math.floor(v) < 0.001) {
      v = Math.floor(v);
    }
    return v;
  })();
</script>

<div
  data-drop-name={drop.name}
  class="drop group w-full sm:w-auto p-2 text-white text-sm flex header items-center justify-between bg-slate-800/30 outline outline-1 outline-slate-600/60 -outline-offset-2"
>
  <div>
    {drop.name}
  </div>
  <div class="text-gray-400 group-data-[drop-active=true]:text-white">
    {chance}%
  </div>
</div>
