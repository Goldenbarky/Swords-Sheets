export function containerClasses(node, breakpoints) {
	const resizeObserver = new ResizeObserver(() => {
		const containerWidth = node.clientWidth;

		const breakpointsArray = Object.entries(breakpoints);
		const classes = breakpointsArray.reduce((prev, [breakpointStr, classes], idx) => {
			node.classList.remove(...classes);
			const breakpoint = +breakpointStr;
			const prevBreakpoint = idx > 0 ? +breakpointsArray[idx - 1][0] : 0;

			if (containerWidth >= breakpoint && breakpoint >= prevBreakpoint) return classes;
			return prev;
		}, []);

		node.classList.add(...classes);
  });

  resizeObserver.observe(node);

	return {
		destroy() {
			resizeObserver.disconnect();
		},
	};
}