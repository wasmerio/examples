<script lang="ts">
  import { onMount } from 'svelte';

  type Color = 'bg-surface-card' | 'bg-primary' | 'bg-secondary' | 'bg-tertiary' | 'bg-accent';

  const COLUMNS: Color[][] = [
    ['bg-surface-card', 'bg-primary',      'bg-surface-card', 'bg-secondary'],
    ['bg-surface-card', 'bg-primary',      'bg-tertiary',     'bg-surface-card'],
    ['bg-surface-card', 'bg-surface-card', 'bg-primary',      'bg-secondary'],
    ['bg-accent',       'bg-secondary',    'bg-surface-card', 'bg-surface-card'],
  ];

  let trackEl: HTMLDivElement;
  let timers: ReturnType<typeof setTimeout>[] = [];

  onMount(() => {
    if (!trackEl) return;

    function cycle() {
      const cols = Array.from(trackEl.children) as HTMLElement[];

      // ── Phase 1: EXIT (900ms) ──
      // All columns shift left; col0 fades out as it leaves
      cols.forEach((col, i) => {
        col.style.transition = 'left 900ms cubic-bezier(0.19, 1, 0.22, 1), opacity 500ms ease';
        // End at the exact CSS :nth-child positions so Phase 2 has zero jump
        col.style.left = `${(i - 1) * 25 + 2}%`;
        if (i === 0) col.style.opacity = '0';
      });

      // ── Phase 2: REPOSITION + ENTRANCE SETUP (600ms after exit finishes) ──
      timers.push(setTimeout(() => {
        const first = cols[0];

        // Move exited column to end of DOM
        trackEl.appendChild(first);

        // Clear inline styles on all columns (CSS :nth-child takes over positions)
        const all = Array.from(trackEl.children) as HTMLElement[];
        // Snap every column to its correct post-rotation position instantly
        // so there is no visual gap between Phase 1 end and Phase 2 start.
        all.forEach((col, i) => {
          col.style.transition = 'none';
          col.style.left = `${i === 3 ? 100 : 2 + i * 25}%`;
          col.style.opacity = '1';
        });

        const entering = all[3];

        // Force reflow so browser registers the new positions
        trackEl.offsetHeight;

        // ── Phase 3: ENTRANCE (600ms) ──
        // Only the entering column slides in from the right;
        // others are already at their correct CSS positions
        entering.style.transition = 'left 700ms cubic-bezier(0.19, 1, 0.22, 1)';
        entering.style.left = '77%';

        // ── Phase 4: REST + NEXT CYCLE ──
        timers.push(setTimeout(() => {
          // Clean up inline styles so CSS :nth-child stays in control
          entering.style.transition = 'none';
          entering.style.left = '';
          
          timers.push(setTimeout(cycle, 900));
        }, 700));
      }, 1500));
    }

    timers.push(setTimeout(cycle, 400));

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  });
</script>

<div class="relative rounded-xl w-full aspect-square overflow-hidden" bind:this={trackEl}>
  {#each COLUMNS as col}
    <div class="col">
      {#each col as color}
        <div class="cell {color} border-default border-border-card"></div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .col {
    position: absolute;
    top: 4%;
    bottom: 4%;
    width: 22%;
    display: flex;
    flex-direction: column;
    gap: 3%;
  }

  .col:nth-child(1) { left: 2%; }
  .col:nth-child(2) { left: 27%; }
  .col:nth-child(3) { left: 52%; }
  .col:nth-child(4) { left: 77%; }

  .cell {
    flex: 1;
    border-radius: 0.375rem;
  }
</style>
