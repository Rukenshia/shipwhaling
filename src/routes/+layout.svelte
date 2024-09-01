<script lang="ts">
  import '../app.css';

  import whale from '$lib/assets/whale.gif';
</script>

<div class="w-full min-h-screen relative flex flex-col">
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
  <div class="flex-grow relative z-10 min-h-screen">
    <div class="w-full pt-32">
      <div class="w-3/4 mx-auto">
        <img src={whale} alt="Whale" class="h-64 mx-auto" />

        <h1
          class="text-center text-3xl sm:text-4xl lg:text-6xl text-white font-bold drop-shadow-2xl uppercase"
        >
          WARSHIP WHALING
        </h1>
        <h2 class="text-center text-base sm:text-xl lg:text-2xl text-cyan-50/80 drop-shadow-2xl">
          Plan your Anniversary Event Rewards and Purchases
        </h2>
      </div>
    </div>
    <div
      class="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-12 gap-4 px-4 lg:px-16 text-cyan-50 mt-16"
    >
      <div class="col-span-1 lg:col-start-2 lg:col-span-4 xl:col-start-2 xl:col-span-10">
        <slot />
      </div>
    </div>
  </div>

  <footer class="bg-cyan-950/80 text-cyan-500 text-center py-4 pt-16 z-20">
    <p>
      Made by Rukenshia (Discord: Rukenshia#4396). This website is not affiliated with Wargaming. <a
        href="https://buymeacoffee.com/rukenshia"
        target="_blank"
        class="underline">Buy me a coffee</a
      >.
    </p>
  </footer>
</div>

<style>
  #wallpaper {
    background-image: url('$lib/assets/wallpaper.jpeg');
  }
</style>
