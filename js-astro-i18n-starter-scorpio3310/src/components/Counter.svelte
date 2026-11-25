<script>
    // Props
    let { translations: t } = $props();

    // State and derived values
    let count = $state(0);
    let multiplied = $derived(count * 2);

    // Helper function for interpolation
    function interpolate(text, value) {
        return text?.replace("{{value}}", value) || "";
    }
</script>

<div
    class="p-8 border rounded-3xl border-black/10 text-center mt-6"
    role="application"
    aria-labelledby="counter-title"
    aria-describedby="counter-description"
>
    <h3 id="counter-title" class="!text-xl">{t.title}</h3>

    <div class="flex items-center gap-2 justify-center mt-4" role="group">
        <button
            onclick={() => count--}
            class="button"
            aria-label={`${t.body?.decrement}`}
            type="button"
        >
            -
        </button>

        <output class="input" aria-live="polite" aria-atomic="true">
            {@html interpolate(t.body?.multiply, count)}:
            <b>{multiplied}</b>
        </output>

        <button
            onclick={() => count++}
            class="button"
            aria-label={`${t.body?.increment}`}
            type="button"
        >
            +
        </button>
    </div>
</div>
