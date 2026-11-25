// "What changes": while the section is pinned, the card track slides sideways.
// At rest the track starts on the content column (1160 wide, 20px gutters on
// narrow screens) and travels until the last card is flush with the column's
// right edge. Ported from the Framer override withHorizontalTrack.
const COLUMN = 1160;
const GUTTER = 20;

export function mount(section) {
  const stage = section.querySelector('.changes-stage');
  const viewport = section.querySelector('.changes-viewport');
  const track = section.querySelector('.changes-track');
  let frame = 0;
  const update = () => {
    frame = 0;
    const rect = section.getBoundingClientRect();
    const pin = rect.height - stage.getBoundingClientRect().height;
    if (pin <= 0) return;
    const p = Math.min(1, Math.max(0, -rect.top / pin));
    const column = Math.min(COLUMN, viewport.clientWidth - GUTTER * 2);
    const left = Math.max(GUTTER, (viewport.clientWidth - column) / 2);
    const travel = Math.max(0, track.offsetWidth - column);
    track.style.setProperty('--track-x', `${left - p * travel}px`);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  update();
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
}
