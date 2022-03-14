export interface ISettings {
	showParagraphs: boolean,
	paraMinSentences: number,
	paraMaxSentences: number
}


export function getNodeSettings(
	node: SceneNode
): ISettings
{
	return JSON.parse(node.getPluginData("settings") || "null");
}


export function setNodeSettings(
	node: SceneNode,
	settings: ISettings
)
{
	node.setPluginData("settings", JSON.stringify(settings));
}
