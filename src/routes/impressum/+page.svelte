<script lang="ts">
  import { base } from '$app/paths';
  import { contactEndpoint } from '$lib/contact';
</script>

<svelte:head>
  <title>Legal Notice (Impressum) | Warship Whaling</title>
  <meta name="description" content="Legal notice and contact information for Warship Whaling." />
</svelte:head>

<main
  lang="en"
  class="mx-auto mb-12 max-w-3xl border border-cyan-100/20 bg-cyan-950/90 p-6 sm:p-10"
>
  <a
    href={`${base}/`}
    class="text-cyan-200 underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
    >Back to home</a
  >

  <h1 class="mt-8 text-4xl font-bold text-white">Legal Notice (Impressum)</h1>
  <p class="mt-2 text-cyan-100">
    Information pursuant to Section 5 of the German Digital Services Act (DDG)
  </p>

  <section aria-labelledby="operator" class="mt-8">
    <h2 id="operator" class="text-2xl font-semibold text-white">Website operator</h2>
    <address class="mt-3 space-y-1 not-italic leading-relaxed text-cyan-50">
      <p>Jan-Henrik Christophersen</p>
      <p>Almstadtstraße 6</p>
      <p>10119 Berlin</p>
      <p>Germany</p>
    </address>
  </section>

  <section aria-labelledby="contact" class="mt-8">
    <h2 id="contact" class="text-2xl font-semibold text-white">Contact</h2>
    <p class="mt-3 leading-relaxed">
      Email:
      <a
        href="mailto:svc-shipwhaling@ruken.pw"
        class="break-words text-cyan-200 underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
        >svc-shipwhaling@ruken.pw</a
      >
    </p>
    {#if contactEndpoint}
      <p class="mt-2">
        <a
          href={`${base}/contact`}
          class="text-cyan-200 underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
          >Contact form</a
        >
      </p>
    {:else}
      <p class="mt-2">
        Phone:
        <a
          href="tel:+4915129486984"
          class="text-cyan-200 underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
          >+49 151 29486984</a
        >
      </p>
    {/if}
  </section>

  <section aria-labelledby="vat" class="mt-8">
    <h2 id="vat" class="text-2xl font-semibold text-white">VAT identification number</h2>
    <p class="mt-3 leading-relaxed">
      VAT identification number pursuant to Section 27a of the German VAT Act (UStG): DE465501756
    </p>
  </section>
</main>
