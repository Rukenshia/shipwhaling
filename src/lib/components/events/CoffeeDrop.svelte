<script lang="ts">
  import bmcLogo from '$lib/assets/bmc-logo.svg';
  import BonusDrop from './BonusDrop.svelte';

  let { chance }: { chance: number } = $props();

  // it's hot cocoa over Christmas; ?cocoa forces it for testing
  const today = new Date();
  const cocoa =
    (today.getMonth() === 11 && today.getDate() >= 24 && today.getDate() <= 26) ||
    new URLSearchParams(window.location.search).has('cocoa');
</script>

<BonusDrop
  icon={bmcLogo}
  label={`Mythic · ${chance * 100}%`}
  title={`1 ${cocoa ? 'Hot cocoa' : 'Coffee'} for Rukenshia`}
  subtitle="this is not a real reward, just an easter egg"
  link={{ href: 'https://buymeacoffee.com/rukenshia', text: 'gift ↗' }}
/>
