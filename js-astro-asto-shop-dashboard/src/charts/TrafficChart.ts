import type { EChartsOption } from "echarts";
import { trafficSources } from "../data/analytics";

export const trafficChartOptions: EChartsOption = {
	animationDuration: 800,
	color: ["#4f46e5", "#06b6d4", "#f59e0b", "#94a3b8"],
	tooltip: { trigger: "item", formatter: "{b}: {c}%" },
	legend: { bottom: 0, icon: "circle", itemWidth: 9, textStyle: { color: "#64748b" } },
	series: [{
		name: "Trafic",
		type: "pie",
		radius: ["48%", "72%"],
		center: ["50%", "43%"],
		avoidLabelOverlap: true,
		itemStyle: { borderColor: "#ffffff", borderWidth: 4, borderRadius: 6 },
		label: { show: false },
		emphasis: { label: { show: true, fontSize: 16, fontWeight: "bold" }, scaleSize: 6 },
		data: trafficSources,
	}],
};
