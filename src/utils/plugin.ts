import {traverseNode} from "@create-figma-plugin/utilities";

export function main(
	func: Function
): Promise<void>
{
	return func()
		.catch(console.error)
		.finally(figma.closePlugin);
}


export function selection<T extends NodeType>(
	filterType?: T
): Array<{ type: T } & SceneNode>
{
	let result = [...figma.currentPage.selection] as Array<{ type: T } & SceneNode>;

	if (filterType) {
		result = result.filter(({type}) => type === filterType);
	}

	return result;
}


export async function processSelection<T extends NodeType>(
	filterType: T,
	func: (node: { type: T } & SceneNode) => void
): Promise<void>
{
	for (const node of selection(filterType)) {
		await func(node);
	}
}


export function findInGroups<T extends NodeType>(
	filterType: T
): Array<{ type: T } & SceneNode>
{
	let result: SceneNode[] = [];

	figma.currentPage.selection.forEach((node) => {
		traverseNode(node, (node) => {
			if (node.type === filterType) {
				result.push(node);
			}
		})
	});

	return result as Array<{ type: T } & SceneNode>;
}


export function loadFontsAsync(
	el: TextNode
): Promise<void[]>
{
	return Promise.all(
		el.getRangeAllFontNames(0, el.characters.length).map(figma.loadFontAsync)
	);
}
