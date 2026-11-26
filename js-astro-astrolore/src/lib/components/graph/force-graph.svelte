<script lang="ts">
    import type { GraphNode, GraphLink } from "./graph";
    import {
        forceSimulation,
        forceLink,
        forceManyBody,
        forceCenter,
        forceCollide,
        type SimulationNodeDatum,
        type Simulation,
        type Force,
    } from "d3-force";
    import { select } from "d3-selection";
    import { zoom, type D3ZoomEvent } from "d3-zoom";
    import { Application, Container, Graphics, Text } from "pixi.js";
    import { navigate } from "astro:transitions/client";
    import { cn } from "$lib/utils";
    import { onMount, onDestroy } from "svelte";

    type SimNode = GraphNode & SimulationNodeDatum;
    type SimLink = { source: string | SimNode; target: string | SimNode };
    type NodeView = { node: SimNode; container: Container; label: Text };

    type Props = {
        nodes: GraphNode[];
        links: GraphLink[];
        class?: string;
        params?: {
            linkDistance?: number;
            linkStrength?: number;
            chargeStrength?: number;
            chargeMaxDistance?: number;
            centerStrength?: number;
            collideDistance?: number;
            boundaryStrength?: number;
        };
    };
    let { nodes, links, class: className, params = {} }: Props = $props();
    let {
        linkDistance = 64,
        linkStrength = 0.5,
        chargeStrength = -400,
        chargeMaxDistance = 200,
        centerStrength = 0.05,
        collideDistance = 32,
        boundaryStrength = 0.5,
    } = $derived(params);

    // Force to keep nodes inside a boundary
    function forceBoundary(
        radius: number,
        cx: number,
        cy: number,
        strength: number,
    ): Force<SimNode, SimLink> {
        let nodes: SimNode[] = [];
        function force(alpha: number) {
            for (const d of nodes) {
                const dx = (d.x ?? cx) - cx;
                const dy = (d.y ?? cy) - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > radius) {
                    const k = ((dist - radius) / dist) * strength * alpha;
                    d.vx = (d.vx ?? 0) - dx * k;
                    d.vy = (d.vy ?? 0) - dy * k;
                }
            }
        }
        force.initialize = (_nodes: SimNode[]) => {
            nodes = _nodes;
        };
        return force;
    }

    function linkEndpointId(end: string | SimNode): string {
        return typeof end === "string" ? end : end.id;
    }

    const colorCache = new Map<string, string>();
    function resolveCssColor(value: string): string {
        const cached = colorCache.get(value);
        if (cached) return cached;

        const probe = document.createElement("div");
        probe.style.color = value;
        document.body.appendChild(probe);
        const computed = getComputedStyle(probe).color;
        document.body.removeChild(probe);

        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = computed;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
        const resolved = `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;

        colorCache.set(value, resolved);
        return resolved;
    }

    let container: HTMLDivElement;
    let app: Application | undefined;
    let simulation: Simulation<SimNode, undefined> | undefined;

    onMount(() => {
        if (!container || nodes.length === 0) return;

        let cancelled = false;

        (async () => {
            const width = container.clientWidth || 800;
            const height = container.clientHeight || 600;

            const pixiApp = new Application();
            await pixiApp.init({
                width,
                height,
                resizeTo: container,
                backgroundAlpha: 0,
                antialias: true,
            });
            if (cancelled) {
                pixiApp.destroy(true);
                return;
            }
            app = pixiApp;
            container.appendChild(app.canvas);

            const world = new Container();
            app.stage.addChild(world);
            app.stage.eventMode = "static";
            app.stage.hitArea = app.screen;

            const foreground = resolveCssColor("var(--foreground)");
            const mutedForeground = resolveCssColor("var(--muted-foreground)");

            const simNodes: SimNode[] = nodes.map((n) => ({ ...n }));
            const simLinks: SimLink[] = links.map((e) => ({ ...e }));

            const adjacencyMap = new Map<string, Set<string>>();
            function addAdjacency(a: string, b: string) {
                let neighbors = adjacencyMap.get(a);
                if (!neighbors) {
                    neighbors = new Set();
                    adjacencyMap.set(a, neighbors);
                }
                neighbors.add(b);
            }
            for (const l of simLinks) {
                const source = linkEndpointId(l.source);
                const target = linkEndpointId(l.target);
                addAdjacency(source, target);
                addAdjacency(target, source);
            }

            const linkGraphics = new Graphics();
            world.addChild(linkGraphics);

            let hoveredId: string | null = null;
            let isPointerOverNode = false;
            let draggingId: string | null = null;
            let dragStart: { x: number; y: number } | null = null;
            let dragMoved = false;
            let currentZoom = 1;
            const labelZoomThreshold = 1;

            function drawLinks(hoverId: string | null) {
                linkGraphics.clear();
                for (const l of simLinks) {
                    const s = l.source as SimNode;
                    const t = l.target as SimNode;
                    const touchesHover =
                        hoverId != null &&
                        (linkEndpointId(l.source) === hoverId ||
                            linkEndpointId(l.target) === hoverId);
                    linkGraphics
                        .moveTo(s.x ?? 0, s.y ?? 0)
                        .lineTo(t.x ?? 0, t.y ?? 0)
                        .stroke({
                            color: mutedForeground,
                            width: 1,
                            alpha: hoverId == null ? 0.5 : touchesHover ? 1 : 0.1,
                        });
                }
            }

            const nodeViews = new Map<string, NodeView>();

            function applyHoverState() {
                const hoverId = draggingId ?? hoveredId;
                for (const [id, view] of nodeViews) {
                    const related =
                        hoverId != null &&
                        (id === hoverId ||
                            (adjacencyMap.get(hoverId)?.has(id) ?? false));
                    view.container.alpha = hoverId == null || related ? 1 : 0.15;
                    view.label.visible =
                        currentZoom >= labelZoomThreshold || related;
                }
                drawLinks(hoverId);
            }

            for (const d of simNodes) {
                const nodeContainer = new Container();
                nodeContainer.eventMode = "static";
                nodeContainer.cursor = "pointer";

                const circle = new Graphics()
                    .circle(0, 0, d.radius ?? 6)
                    .fill(resolveCssColor(d.fill ?? "var(--muted-foreground)"));

                const label = new Text({
                    text: d.title,
                    style: { fontSize: 12, fill: foreground },
                });
                label.anchor.set(0.5, 0);
                label.y = (d.radius ?? 6) + 4;
                label.visible = currentZoom >= labelZoomThreshold;

                nodeContainer.addChild(circle, label);
                world.addChild(nodeContainer);
                nodeViews.set(d.id, { node: d, container: nodeContainer, label });

                nodeContainer.on("pointerdown", (event) => {
                    draggingId = d.id;
                    dragStart = { x: event.global.x, y: event.global.y };
                    dragMoved = false;
                    simulation?.alphaTarget(0.1).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                    applyHoverState();
                });

                nodeContainer.on("pointertap", () => {
                    if (!dragMoved) navigate(d.href);
                });

                nodeContainer.on("pointerover", () => {
                    hoveredId = d.id;
                    isPointerOverNode = true;
                    applyHoverState();
                });
                nodeContainer.on("pointerout", () => {
                    hoveredId = null;
                    isPointerOverNode = false;
                    applyHoverState();
                });
            }

            function endDrag() {
                if (draggingId == null) return;
                const view = nodeViews.get(draggingId);
                if (view) {
                    view.node.fx = null;
                    view.node.fy = null;
                }
                simulation?.alphaTarget(0);
                draggingId = null;
                dragStart = null;
                applyHoverState();
            }
            app.stage.on("pointermove", (event) => {
                if (draggingId == null) return;
                const view = nodeViews.get(draggingId);
                if (!view) return;
                if (
                    dragStart &&
                    Math.hypot(
                        event.global.x - dragStart.x,
                        event.global.y - dragStart.y,
                    ) > 5
                ) {
                    dragMoved = true;
                }
                const p = world.toLocal(event.global);
                view.node.fx = p.x;
                view.node.fy = p.y;
            });
            app.stage.on("pointerup", endDrag);
            app.stage.on("pointerupoutside", endDrag);

            select(container).call(
                zoom<HTMLDivElement, unknown>()
                    .scaleExtent([0.2, 4])
                    .filter(() => !isPointerOverNode)
                    .on("zoom", (event: D3ZoomEvent<HTMLDivElement, unknown>) => {
                        world.position.set(event.transform.x, event.transform.y);
                        world.scale.set(event.transform.k);
                        currentZoom = event.transform.k;
                        applyHoverState();
                    }),
            );

            simulation = forceSimulation(simNodes)
                .force(
                    "link",
                    forceLink<SimNode, SimLink>(simLinks)
                        .id((d) => d.id)
                        .distance(linkDistance)
                        .strength(linkStrength),
                )
                .force(
                    "charge",
                    forceManyBody()
                        .strength(chargeStrength)
                        .distanceMax(chargeMaxDistance),
                )
                .force(
                    "center",
                    forceCenter(width / 2, height / 2).strength(centerStrength),
                )
                .force(
                    "collide",
                    forceCollide<SimNode>(
                        (d) => (d.radius ?? 6) + collideDistance,
                    ),
                )
                .force(
                    "boundary",
                    forceBoundary(
                        2.5 * nodes.length,
                        width / 2,
                        height / 2,
                        boundaryStrength,
                    ),
                );

            simulation.alpha(0.6).restart();
            simulation.on("tick", () => {
                for (const [, view] of nodeViews) {
                    view.container.position.set(
                        view.node.x ?? 0,
                        view.node.y ?? 0,
                    );
                }
                drawLinks(draggingId ?? hoveredId);
            });
        })();

        return () => {
            cancelled = true;
        };
    });

    onDestroy(() => {
        simulation?.stop();
        app?.destroy(true);
    });
</script>

<div bind:this={container} class={cn("w-full h-full", className)}></div>
