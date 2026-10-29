<script lang="ts">
  import { base } from '$app/paths';
  import { contactEndpoint } from '$lib/contact';
  import { onMount } from 'svelte';

  let name = $state('');
  let email = $state('');
  let message = $state('');
  let website = $state('');
  let sending = $state(false);
  let result = $state('');
  let succeeded = $state(false);
  let ready = $state(false);

  onMount(() => {
    ready = true;
  });

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (sending || !contactEndpoint) return;
    sending = true;
    result = '';
    succeeded = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website }),
        signal: controller.signal
      });
      if (!response.ok) {
        result =
          response.status === 429
            ? 'Too many messages have been submitted. Please try later or email us directly.'
            : 'Your message could not be submitted. Please try again or email us directly.';
        return;
      }
      succeeded = true;
      result = 'Your message has been submitted. We will reply to your email address.';
      name = '';
      email = '';
      message = '';
      website = '';
    } catch {
      result =
        'We could not confirm submission. Your message is still here; please try again or email us directly.';
    } finally {
      clearTimeout(timeout);
      sending = false;
    }
  }
</script>

<svelte:head>
  <title>Contact | Warship Whaling</title>
  <meta name="description" content="Contact the operator of Warship Whaling." />
</svelte:head>

<main class="mx-auto mb-12 max-w-3xl border border-cyan-100/20 bg-cyan-950/90 p-6 sm:p-10">
  <a href={`${base}/`} class="text-cyan-200 underline underline-offset-4">Back to home</a>
  <h1 class="mt-8 text-4xl font-bold text-white">Contact</h1>
  <p class="mt-3 leading-relaxed">
    Have a question about Warship Whaling? Send a message below or email
    <a href="mailto:svc-shipwhaling@ruken.pw" class="break-words text-cyan-200 underline"
      >svc-shipwhaling@ruken.pw</a
    >.
  </p>

  {#if contactEndpoint}
    <noscript
      ><p class="mt-4">
        This form requires JavaScript. Please use the email link above instead.
      </p></noscript
    >
    <form onsubmit={submit} class="mt-8 space-y-5" aria-busy={sending}>
      <fieldset disabled={!ready || sending} class="space-y-5">
        <div>
          <label for="contact-name" class="block font-semibold"
            >Name <span class="font-normal text-cyan-100/80">(optional)</span></label
          >
          <input
            id="contact-name"
            name="name"
            autocomplete="name"
            maxlength="100"
            bind:value={name}
            class="mt-2 w-full rounded border border-cyan-100/40 bg-cyan-950 p-3 text-white focus:outline focus:outline-2 focus:outline-cyan-200"
          />
        </div>
        <div>
          <label for="contact-email" class="block font-semibold">Your email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autocomplete="email"
            required
            maxlength="254"
            bind:value={email}
            class="mt-2 w-full rounded border border-cyan-100/40 bg-cyan-950 p-3 text-white focus:outline focus:outline-2 focus:outline-cyan-200"
          />
        </div>
        <div>
          <label for="contact-message" class="block font-semibold">Message</label>
          <textarea
            id="contact-message"
            name="message"
            required
            minlength="10"
            maxlength="5000"
            rows="7"
            bind:value={message}
            aria-describedby="message-help"
            class="mt-2 w-full rounded border border-cyan-100/40 bg-cyan-950 p-3 text-white focus:outline focus:outline-2 focus:outline-cyan-200"
          ></textarea>
          <p id="message-help" class="mt-1 text-sm text-cyan-100/80">
            10–5,000 characters. Please do not include passwords or sensitive account information.
          </p>
        </div>
        <div class="hidden" aria-hidden="true">
          <label for="contact-website">Leave this field empty</label>
          <input
            id="contact-website"
            name="website"
            tabindex="-1"
            autocomplete="off"
            bind:value={website}
          />
        </div>
        <p class="text-sm leading-relaxed text-cyan-100/80">
          We use your details to handle your request and reply by email. Read <a
            href="#contact-privacy"
            class="underline">how we process contact messages</a
          >.
        </p>
        <button
          type="submit"
          class="rounded bg-cyan-200 px-5 py-3 font-semibold text-cyan-950 hover:bg-white focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-cyan-200 disabled:opacity-60"
          >{sending ? 'Sending…' : 'Send message'}</button
        >
      </fieldset>
      <p role="status" aria-live="polite" class={succeeded ? 'text-cyan-100' : 'text-amber-100'}>
        {result}
      </p>
    </form>
  {:else}
    <p class="mt-6 border border-cyan-100/30 p-4">
      The contact form is not available yet. Please email us using the address above.
    </p>
  {/if}

  <section
    id="contact-privacy"
    aria-labelledby="privacy-heading"
    class="mt-10 border-t border-cyan-100/20 pt-6 text-sm leading-relaxed text-cyan-100/80"
  >
    <h2 id="privacy-heading" class="text-2xl font-semibold text-white">
      Privacy for contact messages
    </h2>
    <p class="mt-3">
      Jan-Henrik Christophersen is responsible for processing your message. You can find the postal
      address and contact details in the <a href={`${base}/impressum`} class="underline"
        >Impressum</a
      >.
    </p>
    <p class="mt-3">
      Your email address, message and optional name are used to handle your enquiry. General
      enquiries are processed on the basis of our legitimate interest in responding to visitors
      (Article 6(1)(f) GDPR); enquiries concerning a contract are processed under Article 6(1)(b)
      GDPR. Providing these details is voluntary, but we need an email address and message to
      respond through this form.
    </p>
    <p class="mt-3">
      The form uses Amazon Web Services in Frankfurt to forward messages to our email inbox. Our
      email provider also processes the resulting correspondence. Messages are kept for as long as
      needed to handle the enquiry and any applicable legal retention obligations.
    </p>
    <p class="mt-3">
      For spam prevention, the service processes your IP address and stores a daily hash with
      submission counters. These counters expire after two days and are subsequently removed by
      automatic cleanup. We do not include your IP address in notification emails or log message
      contents. Technical function logs are retained for seven days.
    </p>
    <p class="mt-3">
      You may request access, correction, deletion or restriction of your personal data and, where
      applicable, portability. You may object to processing based on legitimate interests and lodge
      a complaint with a data protection supervisory authority. Please contact us at the email
      address above to exercise your rights.
    </p>
  </section>
</main>
