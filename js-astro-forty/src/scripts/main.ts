// src/scripts/main.ts


const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

const qs = <T extends Element = HTMLElement>(sel: string, root?: ParentNode): T | null => {
    if (!isBrowser) return null;
    return (root ?? document).querySelector(sel) as T | null;
};

const qsa = <T extends Element = HTMLElement>(sel: string, root?: ParentNode): T[] => {
    if (!isBrowser) return [];
    return Array.from((root ?? document).querySelectorAll(sel)) as T[];
};


function onReady(fn: () => void) {
    if (!isBrowser) return;
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
}

/**
 * Smooth scroll for .scrolly anchors, with header offset.
 */
function initScrolly({ headerSelector = "#header", offsetPx = 2 } = {}) {
    const header = qs(headerSelector);

    qsa("a.scrolly[href^='#']").forEach((a) => {
        a.addEventListener("click", (e) => {
            const id = a.getAttribute("href");
            if (!id || id === "#") return;

            const target = qs(id);
            if (!target) return;

            e.preventDefault();

            const headerH = header ? header.getBoundingClientRect().height : 0;
            const y =
                window.scrollY +
                target.getBoundingClientRect().top -
                Math.max(0, headerH - offsetPx);

            window.scrollTo({ top: y, behavior: "smooth" });
        });
    });
}

/**
 * Tiles: use <img> as background, hide original, add .primary link clone & transition behavior.
 */
function initTiles({ wrapperSelector = "#wrapper" } = {}) {
    const wrapper = qs(wrapperSelector);

    qsa<HTMLElement>(".tiles > article").forEach((tile) => {
        const image = qs<HTMLElement>(".image", tile);
        const img = image ? qs<HTMLImageElement>("img", image) : null;
        const link = qs<HTMLAnchorElement>(".link", tile);


        if (img) {
            tile.style.backgroundImage = `url(${(img.getAttribute("src"))})`;
            const pos = img.getAttribute("data-position");
            if (pos) tile.style.backgroundPosition = pos;
            if (image) image.style.display = "none";
        }

        if (!link) return;

        // Clone primary link
        const primary = link.cloneNode(true) as HTMLAnchorElement;
        primary.textContent = "";
        primary.classList.add("primary");
        primary.setAttribute("aria-label", link.textContent?.trim() || "Open");
        tile.appendChild(primary);


        const clickHandler = (e: MouseEvent) => {
            const a = e.currentTarget as HTMLAnchorElement;
            const href = a.getAttribute("href");
            if (!href) return;

            e.preventDefault();
            e.stopPropagation();

            tile.classList.add("is-transitioning");
            wrapper?.classList.add("is-transitioning");

            const target = a.getAttribute("target");

            window.setTimeout(() => {
                if (target === "_blank") window.open(href, "_blank", "noopener,noreferrer");
                else window.location.href = href;
            }, 500);
        };

        link.addEventListener("click", clickHandler);
        primary.addEventListener("click", clickHandler);
    });
}

/**
 * Header alt/reveal logic using IntersectionObserver (Scrollex replacement).
 * Behavior matches your original:
 * - while banner is "active" => header has .alt
 * - when banner leaves => remove .alt, add .reveal
 */
function initHeaderBannerReveal({
    headerSelector = "#header",
    bannerSelector = "#banner",
} = {}) {
    const header = qs(headerSelector);
    const banner = qs(bannerSelector);

    if (!header || !banner) return;
    if (!header.classList.contains("alt")) return;

    const updateRootMargin = () => {
        const headerH = header.getBoundingClientRect().height;
        // Original: bottom: header.height() + 10
        // For IO: we shrink the viewport bottom by headerH+10 so "leave" triggers similarly.
        return `0px 0px -${Math.round(headerH + 10)}px 0px`;
    };

    let io: IntersectionObserver | null = null;

    const createObserver = () => {
        if (io) io.disconnect();

        io = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry) return;

                if (entry.isIntersecting) {
                    header.classList.add("alt");
                    header.classList.remove("reveal");
                } else {
                    header.classList.remove("alt");
                    header.classList.add("reveal");
                }
            },
            { root: null, threshold: 0, rootMargin: updateRootMargin() }
        );

        io.observe(banner);
    };

    createObserver();
    window.addEventListener("resize", createObserver);
}

/**
 * Banner parallax (simple, efficient):
 * - disabled for <=980px like your old code
 * - uses requestAnimationFrame for smoothness
 */
function initParallax({
    selector = "#banner",
    intensity = 0.275,
    disableMql = "(max-width: 980px)",
} = {}) {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const el = document.querySelector<HTMLElement>(selector);
    if (!el || intensity === 0) return;

    const mql = window.matchMedia(disableMql);
    let ticking = false;
    let enabled = false;

    // Set background image from .image > img like the original theme
    const image = el.querySelector<HTMLElement>(".image");
    const img = image ? image.querySelector<HTMLImageElement>("img") : null;

    if (image && img) {
        el.style.backgroundImage = `url(${img.src})`;
        image.style.display = "none";
    }

    // Forty uses layered backgrounds; preserve number of layers
    const getLayerCount = () => {
        const bg = getComputedStyle(el).backgroundImage;
        // crude but works well: number of commas + 1
        return bg ? bg.split(",").length : 1;
    };




    const apply = () => {
        ticking = false;
        if (!enabled) return;

        const multiplier = 1.6; 
        const rect = el.getBoundingClientRect();
        const y = Math.round((-rect.top) * intensity * multiplier);

        const bg = getComputedStyle(el).backgroundImage;
        const layers = bg ? bg.split(",").length : 1;

        if (layers >= 3) {
            el.style.backgroundPosition = `center 0px, center 0px, center ${y}px`;
        } else if (layers === 2) {
            el.style.backgroundPosition = `center 0px, center ${y}px`;
        } else {
            el.style.backgroundPosition = `center ${y}px`;
        }
        //console.log("parallax y:", y, "bg:", getComputedStyle(el).backgroundImage);
    };


    const onScroll = () => {
        if (!enabled) return;
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(apply);
    };

    const enable = () => {
        enabled = true;

        // Set a sane baseline (again preserving layers)
        const layers = getLayerCount();
        if (layers >= 3) el.style.backgroundPosition = "center 0px, center 0px, center 0px";
        else if (layers === 2) el.style.backgroundPosition = "center 0px, center 0px";
        else el.style.backgroundPosition = "center 0px";

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    };

    const disable = () => {
        enabled = false;
        el.style.backgroundPosition = "";
        window.removeEventListener("scroll", onScroll);
    };

    const handle = () => {
        if (mql.matches) disable();
        else enable();
    };

    if (mql.addEventListener) mql.addEventListener("change", handle);
    else mql.addListener(handle);

    handle();
    window.addEventListener("load", onScroll);
    window.addEventListener("resize", onScroll);
}


/**
 * Menu (panel-ish) replacement for your #menu logic.
 * Keeps: body.is-menu-visible + close button + ESC + click outside.
 */
function initMenu({
    menuSelector = "#menu",
    openSelector = 'a[href="#menu"]',
    visibleClass = "is-menu-visible",
} = {}) {
    if (typeof document === "undefined") return;

    const body = document.body;
    const menu = document.querySelector<HTMLElement>(menuSelector);
    if (!menu) return;

    // Move menu to body (matches original template behavior)
    if (menu.parentElement !== body) body.appendChild(menu);

    // Wrap inner
    let inner = menu.querySelector<HTMLElement>(".inner");
    if (!inner) {
        inner = document.createElement("div");
        inner.className = "inner";
        while (menu.firstChild) inner.appendChild(menu.firstChild);
        menu.appendChild(inner);
    }

    // Add close button if missing
    if (!menu.querySelector("a.close")) {
        const close = document.createElement("a");
        close.className = "close";
        close.href = "#menu";
        close.textContent = "Close";
        menu.appendChild(close);
    }

    let locked = false;
    const lock = () => {
        if (locked) return false;
        locked = true;
        window.setTimeout(() => (locked = false), 350);
        return true;
    };

    const show = () => lock() && body.classList.add(visibleClass);
    const hide = () => lock() && body.classList.remove(visibleClass);
    const toggle = () => lock() && body.classList.toggle(visibleClass);

    // Clicking inside shouldn't close
    inner.addEventListener("click", (e: MouseEvent) => e.stopPropagation());

    // Clicking links inside: close then navigate (except #menu)
    inner.addEventListener("click", (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest("a");
        if (!a) return;

        const href = a.getAttribute("href") || "";
        const target = a.getAttribute("target") || "";

        // Allow toggles/close links to just close
        if (href === "" || href === "#" || href === "#menu") {
            e.preventDefault();
            hide();
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        hide();

        window.setTimeout(() => {
            if (target === "_blank") window.open(href, "_blank", "noopener,noreferrer");
            else window.location.href = href;
        }, 250);
    });

    // Click outside closes
    menu.addEventListener("click", (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        hide();
    });

    // Open/toggle links
    document.addEventListener("click", (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest(openSelector);
        if (!a) return;
        e.preventDefault();
        e.stopPropagation();
        toggle();
    });

    // ESC closes
    document.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Escape") hide();
    });
}


onReady(() => {
    // "is-loading" behavior
    document.body.classList.add("is-loading");
    window.setTimeout(() => document.body.classList.remove("is-loading"), 200);

    window.addEventListener("pagehide", () => {
        window.setTimeout(() => {
            qsa<HTMLElement>(".is-transitioning").forEach((el) => el.classList.remove("is-transitioning"));
        }, 250);
    });
    console.log("main.ts running in browser");

    initScrolly();
    initTiles();
    initHeaderBannerReveal();
    initParallax();
    initMenu();
});
