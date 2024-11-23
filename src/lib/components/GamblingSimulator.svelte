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
  import ContainerDrop from './ContainerDrop.svelte';

  let container: Container = $state(SantasGiftContainer);
  let fastRoll = $state(false);

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

  function animateFinalDrop(el: HTMLElement, props: any = {}) {
    anime({
      targets: el,
      backgroundColor: [{ value: 'rgba(30,41,59, 0.3)' }, { value: 'rgb(52,211,153, 0.5)' }],
      outlineColor: [{ value: 'rgba(71,85,105, 0.6)' }, { value: 'rgb(52,211,153, 0.8)' }],
      duration: 1500,
      easing: 'linear',
      loop: false,
      complete: () => {
        el.setAttribute('data-drop-active', 'true');
      },
      ...props
    });
  }

  function gamble() {
    gambling = true;

    if (fastRoll) {
      const finalDropEl = document.querySelector(`[data-drop-name="${lastDrop?.name}"]`);
      if (finalDropEl) {
        // reset last drop
        finalDropEl.setAttribute('data-drop-active', 'false');
        anime({
          targets: finalDropEl,
          backgroundColor: 'rgba(30,41,59, 0.3)',
          outlineColor: 'rgba(71,85,105, 0.6)',
          easing: 'linear',
          loop: false,
          duration: 100
        });
      }

      const finalDrop = getRandomDrop();
      lastDrop = finalDrop;
      gambling = false;
      animateFinalDrop(
        document.querySelector(`[data-drop-name="${finalDrop.name}"]`) as HTMLElement,
        { duration: 250 }
      );
      return;
    }

    const lastDropEl = document.querySelector(`[data-drop-name="${lastDrop?.name}"]`);
    if (lastDropEl) {
      lastDropEl.setAttribute('data-drop-active', 'false');
    }

    const targets = document.querySelectorAll('.drop');
    let animatedEl = lastDropEl ? lastDropEl : randomElement(targets);

    const intv = setInterval(() => {
      anime({
        targets: animatedEl,
        backgroundColor: [
          { value: 'rgba(30,41,59, 0.3)' },
          { value: 'rgb(52,211,153, 0.5)' },
          { value: 'rgba(30,41,59, 0.3)' }
        ],
        outlineColor: [
          { value: 'rgba(71,85,105, 0.6)' },
          { value: 'rgb(52,211,153, 0.8)' },
          { value: 'rgba(71,85,105, 0.6)' }
        ],
        duration: 1000,
        easing: 'linear',
        loop: false
      });

      animatedEl = randomElement(targets);
    }, 100);

    const finalDrop: ItemDrop = getRandomDrop();
    const finalDropEl = document.querySelector(`[data-drop-name="${finalDrop.name}"]`);

    setTimeout(() => {
      clearInterval(intv);

      animateFinalDrop(finalDropEl as HTMLElement);
    }, 4000);

    setTimeout(() => {
      gambling = false;
      lastDrop = finalDrop;
    }, 5500);
  }
</script>

<div class="flex flex-col gap-8">
  <div class="w-full grid grid-cols-6 divide-white/20 gap-4">
    <div class="col-span-6 lg:col-span-1 flex flex-col gap-4">
      <div class="grid grid-cols-3 lg:grid-cols-1 gap-4">
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
      </div>
      <button
        class={`
      items-center
      justify-center
      xl:justify-start
      header gambling-button
      px-8 py-4 transition-all
      backdrop-blur

      bg-emerald-300/20 text-white
      outline outline-2 outline-emerald-200/60 -outline-offset-2
      disabled:bg-emerald-800/40 disabled:text-emerald-300

      hover:bg-emerald-600/60
      uppercase text-2xl font-medium
      flex flex-col gap-4 items-center`}
        disabled={gambling}
        onclick={gamble}
      >
        <DiceIcon />
        <div>gamble</div>
      </button>
      <div class="flex items-center gap-2">
        <button
          type="button"
          onclick={() => {
            fastRoll = !fastRoll;
          }}
          class={`
          group relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center justify-center

          ${fastRoll ? 'bg-emerald-300/20' : 'bg-gray-200/20'}
        `}
          role="switch"
          aria-checked="false"
        >
          <span class="sr-only">fast roll</span>
          <span
            aria-hidden="true"
            class={`
            pointer-events-none absolute left-1 inline-block size-6 transform border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out
            ${fastRoll ? 'translate-x-8' : 'translate-x-0'}
          `}
          ></span>
        </button>
        <span class="header uppercase">Fast roll</span>
      </div>
    </div>

    <div
      class="col-span-6 lg:col-span-5 flex flex-col justify-between gap-4 lg:border-l pl-0 lg:pl-4"
    >
      <div class="w-full flex flex-col gap-8">
        <div class="w-full grid grid-cols-2 lg:grid-cols-3 gap-4 transition-all">
          {#each container.drops as drop (`${container.name}-${drop.name}`)}
            <ContainerDrop {drop} />
          {/each}
        </div>
      </div>
      <div class="">
        <Box variant="dark">
          {#if lastDrop && !gambling}
            <span class="flex items-center gap-2">
              <span> You received: </span>
              <span class="font-sans normal-case text-emerald-400 font-medium"
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
</div>
