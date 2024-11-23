<script lang="ts">
  import anime from 'animejs';
  import { type Container, type ItemDrop } from '$lib/container';
  import DiceIcon from './DiceIcon.svelte';
  import BoxSelect from './BoxSelect.svelte';
  import { SantasGiftContainer } from '$lib/containers/2024-santas-gift-container';
  import { SantasMegaGiftContainer } from '$lib/containers/2024-santas-mega-gift-container';
  import festiveToken from '$lib/assets/festive-token.png';
  import Box from './Box.svelte';
  import { GoldenContainer } from '$lib/containers/2024-golden-container';

  let container: Container = $state(SantasGiftContainer);

  const randomElement = (arr: NodeList | any[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  function getRandomDrop(): ItemDrop {
    const random = Math.random();

    let cum = 0;
    for (const drop of container.drops) {
      cum += drop.probability;
      if (random < cum) {
        return drop;
      }
    }

    // oopsie
    console.error('No drop found', random, cum);
  }

  function prettyAmount(amount: number | undefined): string {
    return new Intl.NumberFormat('en-US').format(amount);
  }

  let lastDrop: ItemDrop | undefined = $state(undefined);
  let lastDroppedItem = $derived(lastDrop ? randomElement(lastDrop?.items) : undefined);
  let gambling = $state(false);

  function gamble() {
    gambling = true;

    const targets = document.querySelectorAll('.drop');
    let animatedEl = lastDrop
      ? document.querySelector(`[data-drop-name="${lastDrop.name}"]`)
      : randomElement(targets);
    let finalAnimationStarted = false;

    const intv = setInterval(() => {
      anime({
        targets: animatedEl,
        backgroundColor: [
          { value: 'rgba(255, 255, 255, 0.1)' },
          { value: 'rgb(252,211,77, 0.5)' },
          { value: 'rgba(255, 255, 255, 0.1)' }
        ],
        outlineColor: [
          { value: 'rgba(255, 255, 255, 0.6)' },
          { value: 'rgb(252,211,77, 0.8)' },
          { value: 'rgba(255, 255, 255, 0.6)' }
        ],
        duration: 1000,
        easing: 'linear',
        loop: false
      });

      if (finalAnimationStarted) {
        return;
      }
      animatedEl = randomElement(targets);
    }, 100);

    const finalDrop: ItemDrop = getRandomDrop();
    const finalDropEl = document.querySelector(`[data-drop-name="${finalDrop.name}"]`);

    setTimeout(() => {
      clearInterval(intv);

      finalAnimationStarted = true;
      anime({
        targets: finalDropEl,
        backgroundColor: [{ value: 'rgba(255, 255, 255, 0.1)' }, { value: 'rgb(252,211,77, 0.5)' }],
        outlineColor: [{ value: 'rgba(255, 255, 255, 0.1)' }, { value: 'rgb(252,211,77, 0.8)' }],
        duration: 1500,
        easing: 'linear',
        loop: false
      });
    }, 4000);

    setTimeout(() => {
      gambling = false;
      lastDrop = finalDrop;
    }, 5500);
  }
</script>

<div class="flex gap-8 flex-wrap xl:flex-nowrap xl:divide-x divide-white/20">
  <div class="w-full xl:w-64 grid grid-cols-2 xl:grid-cols-1 gap-8">
    <BoxSelect
      choices={[
        {
          //icon: SantasGiftContainer.icon,
          icon: festiveToken,
          name: SantasGiftContainer.name,
          value: SantasGiftContainer
        },
        {
          icon: festiveToken,
          name: SantasMegaGiftContainer.name,
          value: SantasMegaGiftContainer
        },
        {
          icon: festiveToken,
          name: GoldenContainer.name,
          value: GoldenContainer
        }
      ]}
      selected={container}
      disabled={gambling}
      onSelected={(value: Container) => {
        container = value;
        lastDrop = undefined;
      }}
    />
    <button
      class={`
      items-center
      justify-center
      xl:justify-start
      header gambling-button
      col-span-2 xl:col-span-1
      px-8 py-4 transition-all
      backdrop-blur

      bg-emerald-300/20 text-white
      outline outline-2 outline-emerald-200/60 -outline-offset-2
      disabled:bg-emerald-800/40 disabled:text-emerald-300

      hover:bg-emerald-600/60
      uppercase text-2xl font-medium
      flex gap-4 items-center`}
      disabled={gambling}
      onclick={gamble}
    >
      <DiceIcon />
      gamble
    </button>
  </div>

  <div class="w-full flex flex-col justify-between">
    <div class="w-full flex flex-col gap-8 xl:pl-8">
      <div class="w-full grid grid-cols-3 gap-4 transition-all">
        {#each container.drops as drop}
          <div
            data-drop-name={drop.name}
            class="drop w-full sm:w-auto p-2 text-white text-sm flex flex-col header items-center justify-center bg-white/10 outline outline-1 outline-white/60 -outline-offset-2"
          >
            {drop.name}
          </div>
        {/each}
      </div>
    </div>
    <div class="pl-8">
      <Box variant="dark">
        {#if lastDrop && !gambling}
          <span>
            You received:
            <span class="font-sans normal-case text-cyan-500 font-medium"
              >{#if lastDroppedItem?.amount > 1}
                {prettyAmount(lastDroppedItem?.amount)}
              {/if}
              {lastDroppedItem?.name}</span
            >
          </span>
        {:else}
          {gambling ? 'Rolling...' : 'Click "GAMBLE" to roll'}
        {/if}
      </Box>
    </div>
  </div>
</div>
