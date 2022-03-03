export function main(
	func: Function): Promise<void>
{
	return func()
		.catch(console.error)
		.finally(figma.closePlugin);
}


export function selection(
	filterType: NodeType): SceneNode[]
{
	let result: SceneNode[] = [...figma.currentPage.selection];

	if (filterType) {
		result = result.filter(({type}) => type === filterType);
	}

	return result;
}


export function loadFontsAsync(
	el: TextNode): Promise<void[]>
{
	return Promise.all(
		el.getRangeAllFontNames(0, el.characters.length).map(figma.loadFontAsync)
	);
}
