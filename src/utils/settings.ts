import {loadSettingsAsync, saveSettingsAsync} from "@create-figma-plugin/utilities";


export interface NodeSettings {
	showParagraphs: boolean,
	paraMinSentences: number,
	paraMaxSentences: number
}
export interface PluginSettings {
	nodeSettings: NodeSettings
}

const DefaultNodeSettings: NodeSettings = {
	showParagraphs: true,
	paraMinSentences: 2,
	paraMaxSentences: 5
};
const DefaultPluginSettings: PluginSettings = {
	nodeSettings: DefaultNodeSettings
};


export async function getPluginSettings(
	defaultSettings: PluginSettings = DefaultPluginSettings
): Promise<PluginSettings>
{
	return await loadSettingsAsync(defaultSettings);
}


export async function setPluginSettings<K extends keyof PluginSettings>(
	settings: Pick<PluginSettings, K>
): Promise<void>
{
	return await saveSettingsAsync({
		...DefaultPluginSettings,
		...settings
	});
}


export function getNodeSettings(
	node: SceneNode
): NodeSettings
{
	return JSON.parse(node.getPluginData("settings") || "null");
}


export function setNodeSettings(
	node: SceneNode,
	settings: NodeSettings
)
{
	node.setPluginData("settings", JSON.stringify(settings));
}
