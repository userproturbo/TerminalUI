
const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const grid = document.querySelector(".grid");
const hero = document.querySelector(".hero");
const scanButton = hero?.querySelector(".scan-trigger");
const heroLines = hero?.querySelectorAll(".hero-line") ?? [];
const heroSideDots = hero?.querySelectorAll(".hero-dot-side") ?? [];
const heroBottomDots = hero?.querySelectorAll(".hero-dot-bottom") ?? [];
const heroBarsLeft = hero?.querySelectorAll(".hero-bar-left") ?? [];
const heroBarsRight = hero?.querySelectorAll(".hero-bar-right") ?? [];
const scanCenters = hero?.querySelectorAll(".scan-center") ?? [];
const heroBarsLeftSeq = Array.from(heroBarsLeft).reverse();
const heroBarsRightSeq = Array.from(heroBarsRight).reverse();
const heroBarsAll = [...heroBarsLeftSeq, ...heroBarsRightSeq];

const shouldGate = Boolean(
  hero && window.matchMedia?.("(min-width: 760px)").matches
);

const lockGrid = () => {
  grid?.classList.add("is-locked");
  grid?.classList.remove("is-revealed");
};

const revealGrid = () => {
  grid?.classList.add("is-revealed");
  grid?.classList.remove("is-locked");
};

if (shouldGate) {
  lockGrid();
} else {
  revealGrid();
}

let scanInProgress = false;
let barLoopActive = false;
let barCycleTimer = null;

const sleep = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const BAR_CYCLE_INTERVAL = 30000;
const barLoopConfig = {
  blink: 750,
  fade: 1000,
  step: 140,
};

const setBarsLit = (bars, isLit) => {
  bars.forEach((bar) => bar.classList.toggle("is-lit", isLit));
};

const runSequentialRebuild = async (delay) => {
  const steps = Math.max(heroBarsLeftSeq.length, heroBarsRightSeq.length);

  for (let index = 0; index < steps; index += 1) {
    heroBarsLeftSeq[index]?.classList.add("is-lit");
    heroBarsRightSeq[index]?.classList.add("is-lit");
    if (delay > 0) {
      await sleep(delay);
    }
  }
};

const runBarCycle = async () => {
  if (
    barLoopActive ||
    prefersReducedMotion ||
    !hero ||
    heroBarsAll.length === 0 ||
    !hero.classList.contains("is-done")
  ) {
    return;
  }

  barLoopActive = true;
  setBarsLit(heroBarsAll, true);
  hero.classList.remove("bar-fade", "bar-dim");
  hero.classList.add("bar-blink");
  await sleep(barLoopConfig.blink);
  hero.classList.remove("bar-blink");
  hero.classList.add("bar-fade");
  await sleep(barLoopConfig.fade);
  hero.classList.remove("bar-fade");
  hero.classList.add("bar-dim");
  setBarsLit(heroBarsAll, false);
  await runSequentialRebuild(barLoopConfig.step);
  hero.classList.remove("bar-dim");
  setBarsLit(heroBarsAll, true);
  barLoopActive = false;
};

const scheduleBarCycle = () => {
  if (
    prefersReducedMotion ||
    !hero ||
    !hero.classList.contains("is-done") ||
    barCycleTimer
  ) {
    return;
  }

  barCycleTimer = setTimeout(async () => {
    barCycleTimer = null;
    await runBarCycle();
    if (hero?.classList.contains("is-done")) {
      scheduleBarCycle();
    }
  }, BAR_CYCLE_INTERVAL);
};

const completeSequence = () => {
  if (!hero) return;
  hero.classList.remove("is-scanning");
  hero.classList.remove("is-active");
  hero.classList.add("is-done");
  revealGrid();
  scanInProgress = false;
  scheduleBarCycle();
};

const runBarsSequence = () => {
  const steps = Math.max(heroBarsLeftSeq.length, heroBarsRightSeq.length);
  const barDelay = prefersReducedMotion ? 0 : 120;

  if (!steps) {
    completeSequence();
    return;
  }

  if (barDelay === 0) {
    heroBarsLeftSeq.forEach((bar) => bar.classList.add("is-lit"));
    heroBarsRightSeq.forEach((bar) => bar.classList.add("is-lit"));
    completeSequence();
    return;
  }

  let index = 0;
  const timer = setInterval(() => {
    heroBarsLeftSeq[index]?.classList.add("is-lit");
    heroBarsRightSeq[index]?.classList.add("is-lit");
    index++;

    if (index >= steps) {
      clearInterval(timer);
      completeSequence();
    }
  }, barDelay);
};

const startScanSequence = () => {
  if (!hero || scanInProgress || hero.classList.contains("is-done")) return;

  scanInProgress = true;
  hero.classList.add("is-scanning");
  scanButton?.setAttribute("disabled", "true");

  const scanDuration = prefersReducedMotion ? 0 : 3000;
  const lineDuration = prefersReducedMotion ? 0 : 1200;
  const sideDelay = prefersReducedMotion ? 0 : 220;

  const startActivation = () => {
    hero.classList.remove("is-scanning");
    hero.classList.add("is-active");

    scanCenters.forEach((node) => node.classList.add("is-lit"));

    setTimeout(() => {
      heroLines.forEach((line) => line.classList.add("is-active"));
      heroSideDots.forEach((dot) => dot.classList.add("is-lit"));

      setTimeout(() => {
        heroLines.forEach((line) => {
          line.classList.remove("is-active");
          line.classList.add("is-lit");
        });
        heroBottomDots.forEach((dot) => dot.classList.add("is-lit"));
        runBarsSequence();
      }, lineDuration);
    }, sideDelay);
  };

  if (scanDuration === 0) {
    startActivation();
  } else {
    setTimeout(startActivation, scanDuration);
  }
};

if (scanButton && shouldGate) {
  scanButton.addEventListener("click", startScanSequence);
} else if (hero && !shouldGate) {
  scanCenters.forEach((node) => node.classList.add("is-lit"));
}

if (!prefersReducedMotion) {
  const cardBars = document.querySelectorAll(".grid .matrix-bar");
  const cardLines = document.querySelectorAll(".grid .matrix-line");
  const cardDots = document.querySelectorAll(".grid .matrix-dot");

  let cardBarIndex = 0;
  let cardLineIndex = 0;
  let cardDotIndex = 0;
  let tick = 0;

  const clearActive = (nodes) => {
    nodes.forEach((node) => node.classList.remove("is-active"));
  };

  setInterval(() => {
    clearActive(cardBars);
    clearActive(cardLines);
    clearActive(cardDots);

    const useLineSignal = tick % 2 === 1;

    if (useLineSignal && cardLines.length) {
      cardLines[cardLineIndex % cardLines.length]?.classList.add("is-active");
      cardLineIndex++;

      if (cardDots.length) {
        cardDots[cardDotIndex % cardDots.length]?.classList.add("is-active");
        cardDotIndex++;
      }
    } else if (cardBars.length) {
      cardBars[cardBarIndex % cardBars.length]?.classList.add("is-active");
      cardBarIndex++;
    }

    tick++;
  }, 200);
}
