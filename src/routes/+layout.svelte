<script lang="ts">
  import '../app.css';

  import whale from '$lib/assets/whale.gif';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="w-full min-h-screen relative flex flex-col">
  <a
    href="https://convoy.in.fkn.space"
    target="_blank"
    rel="noopener noreferrer"
    class="group relative z-20 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5 border-b border-amber-200/25 bg-cyan-950/85 px-4 py-2.5 text-center backdrop-blur-sm transition hover:border-amber-200/50 hover:bg-cyan-900/85 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber-300"
  >
    <span
      class="header text-xs font-medium uppercase tracking-wider text-cyan-100/85 sm:text-sm"
    >
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
      <span
        aria-hidden="true"
        class="inline-block transition-transform group-hover:translate-x-1"
      >
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
        <img src={whale} alt="Animated anniversary gift" class="h-64 mx-auto" />

        <h1
          class="text-center text-3xl sm:text-4xl lg:text-6xl text-white font-bold drop-shadow-2xl uppercase"
        >
          WARSHIP WHALING
        </h1>
        <h2 class="text-center text-base sm:text-xl lg:text-2xl text-cyan-50/80 drop-shadow-2xl">
          Plan your 11th Anniversary Rewards
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
        href="https://buymeacoffee.com/rukenshia"
        target="_blank"
        class="underline">Buy me a coffee</a
      >.
    </p>
  </footer>
</div>

<style>
  #wallpaper {
    background-image: url('/social_banner.jpg');
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
    .pennant {
      animation: none;
    }
  }
</style>
