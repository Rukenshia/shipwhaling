<script>
  import Title from '$lib/components/Title.svelte';
</script>

<div class="space-y-8">
  <div class="max-w-xl mx-auto rounded p-8 bg-slate-950/20 shadow-inner inset-0">
    <Title>
      Christmas Event

      {#snippet subtitle()}
        <div>
          Festive Rewards are available. <a class="underline" href="/">Open the event calculator</a
          >.
        </div>
      {/snippet}
    </Title>
  </div>
</div>
