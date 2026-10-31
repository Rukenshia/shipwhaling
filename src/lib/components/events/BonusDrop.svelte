<script lang="ts">
  import { scale } from 'svelte/transition';
  import { backOut } from 'svelte/easing';

  let {
    icon,
    iconClass = '',
    label,
    title,
    subtitle,
    link
  }: {
    icon: string;
    iconClass?: string;
    label: string;
    title: string;
    subtitle: string;
    link?: { href: string; text: string };
  } = $props();
</script>

<!-- easter egg: a bonus "drop" that is not part of any real drop table, styled like a slot card -->
<div
  in:scale={{ start: 0.7, duration: 400, delay: 300, easing: backOut }}
  class="bonus relative flex shrink-0 items-center gap-3 overflow-hidden bg-orange-500/10 px-3 py-2 text-left outline outline-2 -outline-offset-2 outline-orange-300/50 sm:gap-4 sm:px-4 sm:py-3"
>
  <div class="flex h-10 w-12 shrink-0 items-center justify-center">
    <img src={icon} alt="" class="max-h-full max-w-full object-contain {iconClass}" />
  </div>
  <div class="min-w-0 flex-1">
    <div class="header truncate text-xs font-semibold uppercase tracking-widest text-orange-300">
      <span class="hidden sm:inline">Bonus ·</span>
      {label}
    </div>
    <div class="mt-0.5 font-bold normal-case leading-tight text-white">{title}</div>
    <div class="truncate text-xs normal-case text-gray-400">{subtitle}</div>
  </div>
  {#if link}
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer"
      class="shrink-0 text-xs normal-case text-orange-200/80 underline decoration-orange-200/30 underline-offset-2 transition-colors hover:text-white"
    >
      {link.text}
    </a>
  {/if}
</div>

<style>
  /* one flash when it drops, then it settles like any other card */
  .bonus {
    animation: flash 1.6s ease-out 0.5s both;
  }

  .bonus::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      100deg,
      transparent 30%,
      rgb(255 255 255 / 0.25) 50%,
      transparent 70%
    );
    transform: translateX(-100%);
    animation: shine 1.1s ease-in-out 0.65s forwards;
    pointer-events: none;
  }

  /* turns any icon gold, e.g. the golden whale */
  .golden {
    filter: sepia(1) saturate(4) hue-rotate(-12deg) brightness(1.15)
      drop-shadow(0 0 6px rgb(251 191 36 / 0.8));
  }

  @keyframes flash {
    0% {
      box-shadow: 0 0 0 0 rgb(251 146 60 / 0);
    }
    25% {
      box-shadow: 0 0 56px -6px rgb(251 146 60 / 0.8);
    }
    100% {
      box-shadow: 0 0 40px -14px rgb(251 146 60 / 0.4);
    }
  }

  @keyframes shine {
    to {
      transform: translateX(100%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .bonus,
    .bonus::after {
      animation: none;
    }
  }
</style>
