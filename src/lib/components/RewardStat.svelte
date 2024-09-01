<script lang="ts">
  import Title from './Title.svelte';

  export let title: string;
  export let value: number;
</script>

<div class="bg-slate-950/50 rounded px-8 py-4">
  <Title size="text-6xl">
    {value}

    <div slot="subtitle">
      {title}
    </div>
  </Title>
</div>
