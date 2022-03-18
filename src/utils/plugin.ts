export function main(
	func: Function
): Promise<void>
{
	return func()
		.catch(console.error)
		.finally(figma.closePlugin);
}


export function selection<T extends NodeType>(
	filterType: T
): Array<{ type: T } & SceneNode>
{
	let result = [...figma.currentPage.selection] as Array<{ type: T } & SceneNode>;

	if (filterType) {
		result = result.filter(({type}) => type === filterType);
	}

	return result;
}


export async function processSelection<T extends NodeType>(
	type: T,
	func: (node: { type: T } & SceneNode) => void
): Promise<void>
{
	for (const node of selection(type)) {
		await func(node);
	}
}


export function loadFontsAsync(
	el: TextNode
): Promise<void[]>
{
	return Promise.all(
		el.getRangeAllFontNames(0, el.characters.length).map(figma.loadFontAsync)
	);
}
