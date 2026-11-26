import { PieChart } from "echarts/charts";
import { LegendComponent, TooltipComponent } from "echarts/components";
import { init, use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { trafficChartOptions } from "../../charts/TrafficChart";

use([PieChart, LegendComponent, TooltipComponent, CanvasRenderer]);

export function mountTrafficChart(container: HTMLDivElement) {
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const chart = init(container, undefined, {
		renderer: "canvas",
		devicePixelRatio: Math.min(window.devicePixelRatio, 2),
	});
	chart.setOption({ ...trafficChartOptions, animation: !reduceMotion });

	let frame = 0;
	const resizeObserver = new ResizeObserver(() => {
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => chart.resize());
	});
	resizeObserver.observe(container);

	return () => {
		cancelAnimationFrame(frame);
		resizeObserver.disconnect();
		chart.dispose();
	};
}
