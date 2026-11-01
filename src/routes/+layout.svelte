<script lang="ts">
  import '../app.css';
  import { base } from '$app/paths';

  import whale from '$lib/assets/christmas.png';
  import snowflake from '$lib/assets/christmas2026/snowflake.png';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  // easter egg: click the whale a few times in a row; it gets shinier until it bursts into snowflakes
  const WHALE_CLICKS = 7;
  let whaleClicks = $state(0);
  let whaleResetTimer: ReturnType<typeof setTimeout> | undefined;
  let whalePoke = $state(0);
  let whalePhase: 'idle' | 'burst' | 'return' = $state('idle');
  let whaleEl: HTMLElement | undefined = $state(undefined);
  let flakeBurst:
    | {
        id: number;
        x: number;
        y: number;
        flakes: { dx: number; up: number; fall: number; rot: number; size: number; dur: number }[];
      }
    | undefined = $state(undefined);

  function pokeWhale() {
    if (whalePhase !== 'idle') return;
    whalePoke++;
    whaleClicks++;
    clearTimeout(whaleResetTimer);
    if (whaleClicks >= WHALE_CLICKS) {
      burstWhale();
    } else {
      whaleResetTimer = setTimeout(() => (whaleClicks = 0), 1500);
    }
  }

  function burstWhale() {
    whalePhase = 'burst';
    if (whaleEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const box = whaleEl.getBoundingClientRect();
      flakeBurst = {
        id: whalePoke,
        x: box.left + box.width / 2,
        y: box.top + box.height / 2,
        flakes: Array.from({ length: 36 }, () => {
          const angle = Math.random() * Math.PI * 2;
          const power = 80 + Math.random() * 180;
          return {
            dx: Math.cos(angle) * power,
            up: Math.sin(angle) * power * 0.6 - 60,
            fall: window.innerHeight * (0.5 + Math.random() * 0.5),
            rot: (Math.random() - 0.5) * 720,
            size: 14 + Math.random() * 22,
            dur: 2.2 + Math.random() * 1.4
          };
        })
      };
    }
    setTimeout(() => {
      whaleClicks = 0;
      whalePhase = 'return';
    }, 2200);
    setTimeout(() => {
      whalePhase = 'idle';
      flakeBurst = undefined;
    }, 3800);
  }
</script>

<div class="w-full min-h-screen relative flex flex-col">
  <a
    href="https://convoy.in.fkn.space"
    target="_blank"
    rel="noopener noreferrer"
    class="group relative z-20 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5 border-b border-amber-200/25 bg-cyan-950/85 px-4 py-2.5 text-center backdrop-blur-sm transition hover:border-amber-200/50 hover:bg-cyan-900/85 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber-300"
  >
    <span class="header text-xs font-medium uppercase tracking-wider text-cyan-100/85 sm:text-sm">
      <svg
        viewBox="0 0 22 12"
        aria-hidden="true"
        class="pennant mr-1.5 inline-block h-3 w-auto -translate-y-px drop-shadow"
      >
        <path d="M0 0 L22 6 L0 12 Z" fill="#fcd34d" />
        <path d="M0 0 L11 3 L11 9 L0 12 Z" fill="#f59e0b" />
      </svg>
      Looking to plan your
      <span class="text-amber-300">Holiday&nbsp;Convoy</span> rewards?
      <span
        class="font-bold text-white underline decoration-amber-300/50 decoration-2 underline-offset-4 transition group-hover:decoration-amber-300"
      >
        Check out the Holiday Convoy Planner
      </span>
      <span aria-hidden="true" class="inline-block transition-transform group-hover:translate-x-1">
        →
      </span>
    </span>
  </a>

  <div class="fixed inset-0 z-0">
    <div id="wallpaper" class="absolute inset-0 bg-cover bg-bottom"></div>
    <div class="absolute inset-0 bg-cyan-950 opacity-50"></div>
    <div
      class="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/70 to-cyan-950"
    ></div>
    <div class="pointer-events-none absolute bottom-0 right-0 overflow-hidden">
      <div
        class="-mr-[24rem] -mb-[20rem] w-[48rem] h-[80rem] bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-cyan-950 via-transparent to-transparent"
      ></div>
    </div>
    <div class="pointer-events-none absolute bottom-0 left-0 overflow-hidden opacity-90">
      <div
        class="-ml-[24rem] -mb-[24rem] w-[48rem] h-[48rem] bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-cyan-950 via-transparent to-transparent"
      ></div>
    </div>
  </div>
  <div class="flex-grow relative z-10 min-h-screen pt-8 lg:pt-32">
    <div
      class="grid grid-cols-1 lg:grid-cols-10 xl:grid-cols-12 gap-4 px-4 lg:px-16 text-cyan-50 mt-8 lg:mt-16"
    >
      <div class="col-span-1 lg:col-span-10 xl:col-span-12 mx-auto mb-16">
        <div class="relative mx-auto w-fit" bind:this={whaleEl}>
          <button
            type="button"
            tabindex="-1"
            class="whale relative block cursor-default"
            class:whale-burst={whalePhase === 'burst'}
            class:whale-return={whalePhase === 'return'}
            style="--glow: {whaleClicks}"
            onclick={pokeWhale}
          >
            {#key whalePoke}
              <img
                src={whale}
                alt="Christmas whale"
                class="h-64 select-none"
                class:whale-wiggle={whalePoke > 0 && whalePhase === 'idle'}
                draggable="false"
              />
              {#if whaleClicks > 0 && whalePhase === 'idle'}
                <!-- shine sweep, masked to the whale's shape -->
                <span
                  class="whale-shine pointer-events-none absolute inset-0"
                  style="mask-image: url({whale}); -webkit-mask-image: url({whale})"
                ></span>
              {/if}
            {/key}
          </button>
        </div>
        {#if flakeBurst}
          {#key flakeBurst.id}
            <div
              class="pointer-events-none fixed z-50"
              style="left: {flakeBurst.x}px; top: {flakeBurst.y}px"
              aria-hidden="true"
            >
              {#each flakeBurst.flakes as flake}
                <img
                  src={snowflake}
                  alt=""
                  class="flake absolute max-w-none"
                  style="--dx: {flake.dx}px; --up: {flake.up}px; --fall: {flake.fall}px; --rot: {flake.rot}deg; width: {flake.size}px; margin: -{flake.size /
                    2}px; animation-duration: {flake.dur}s"
                />
              {/each}
            </div>
          {/key}
        {/if}

        <h1
          class="text-center text-3xl sm:text-4xl lg:text-6xl text-white font-bold drop-shadow-2xl uppercase"
        >
          WARSHIP WHALING
        </h1>
        <h2
          class="flex items-center justify-center gap-2 text-center text-base sm:text-xl lg:text-2xl text-cyan-50/80 drop-shadow-2xl"
        >
          <img src={snowflake} alt="" class="h-6 w-6 shrink-0 object-contain sm:h-8 sm:w-8" />
          Plan your Christmas Event Rewards
        </h2>
      </div>
      <div class="col-span-1 lg:col-start-1 lg:col-span-9 xl:col-start-2 xl:col-span-10">
        {@render children?.()}
      </div>
    </div>
  </div>

  <footer class="bg-cyan-950/80 text-cyan-500 text-center py-4 pt-16 z-20">
    <p>
      Made by Rukenshia (Discord: Rukenshia). This website is not affiliated with Wargaming. <a
        href={`${base}/impressum`}
        class="underline">Impressum</a
      >.
    </p>
  </footer>
</div>

<style>
  #wallpaper {
    background-image: url('$lib/assets/wallpaper.jpeg');
  }

  .whale {
    --amp: calc(3deg + var(--glow) * 1.5deg);
    filter: brightness(calc(1 + var(--glow) * 0.07))
      drop-shadow(0 0 calc(var(--glow) * 4px) rgb(224 242 254 / 0.8));
    transition: filter 0.6s ease-out;
  }

  .whale-wiggle {
    animation: whale-wiggle 0.35s ease-in-out;
  }

  .whale-shine {
    background: linear-gradient(
        100deg,
        transparent 35%,
        rgb(255 255 255 / 0.85) 50%,
        transparent 65%
      )
      no-repeat;
    background-size: 250% 100%;
    mask-size: contain;
    mask-repeat: no-repeat;
    opacity: calc(0.25 + var(--glow) * 0.1);
    animation: whale-shine 0.6s ease-out forwards;
  }

  .whale-burst {
    animation: whale-burst 0.45s ease-in forwards;
  }

  .whale-return {
    animation: whale-return 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .flake {
    left: 0;
    top: 0;
    opacity: 0;
    animation-name: flake;
    animation-fill-mode: forwards;
    animation-delay: 0.3s;
  }

  @keyframes whale-wiggle {
    0%,
    100% {
      transform: rotate(0);
    }
    30% {
      transform: rotate(calc(var(--amp) * -1)) scale(1.03);
    }
    65% {
      transform: rotate(var(--amp));
    }
  }

  @keyframes whale-shine {
    from {
      background-position: 100% 0;
    }
    to {
      background-position: -50% 0;
    }
  }

  @keyframes whale-burst {
    0% {
      transform: scale(1);
    }
    60% {
      transform: scale(1.2) rotate(-4deg);
      filter: brightness(3) drop-shadow(0 0 40px white);
      opacity: 1;
    }
    100% {
      transform: scale(0.3);
      filter: brightness(4) drop-shadow(0 0 60px white);
      opacity: 0;
    }
  }

  @keyframes whale-return {
    from {
      transform: scale(0.4);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* burst outwards, then fall and drift down the page */
  @keyframes flake {
    0% {
      opacity: 1;
      transform: translate(0, 0) rotate(0) scale(0.3);
      animation-timing-function: cubic-bezier(0.2, 0.8, 0.4, 1);
    }
    18% {
      opacity: 1;
      transform: translate(var(--dx), var(--up)) rotate(calc(var(--rot) * 0.3)) scale(1);
      animation-timing-function: cubic-bezier(0.5, 0, 0.9, 0.6);
    }
    100% {
      opacity: 0;
      transform: translate(calc(var(--dx) * 1.4), var(--fall)) rotate(var(--rot)) scale(0.9);
    }
  }

  .pennant {
    transform-origin: left center;
    animation: flutter 2.6s ease-in-out infinite;
  }

  @keyframes flutter {
    0%,
    100% {
      transform: skewY(0deg);
    }
    50% {
      transform: skewY(-5deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .whale-wiggle,
    .whale-shine,
    .whale-burst,
    .whale-return,
    .pennant {
      animation: none;
    }
  }
</style>
