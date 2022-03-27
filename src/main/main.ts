import {emit, on, showUI} from "@create-figma-plugin/utilities";
import {debounce} from "debounce";
import {
	findInGroups,
	loadFontsAsync,
	processSelection,
	selection
} from "../utils/plugin";
import {appendRandomText, getRandomSentence} from "./sentences"
import {appendText, getWordCount, splitWords} from "../utils/text";
import {
	getNodeSettings,
	getPluginSettings,
	hasNodeSettings,
	NodeSettings,
	PluginSettings,
	setNodeSettings,
	setPluginSettings
} from "../utils/settings";


const spacePattern = / +/;
const spaceNewlinePattern = / *\n+/g;
const periodPattern = /\.\s*/g;
const relaunchButtons = {
	update: "",
	randomize: ""
};
const getSentenceCountCache: Record<string, () => number> = {
	"0": () => 0
};
const checkSelectionInterval = 1000;


let settings: PluginSettings;
let lastNodeSettings: NodeSettings;
let lastNodeSizeHash: string;
let selectionTimer: number;


function getSelectedPlaceholders(): TextNode[]
{
	return findInGroups("TEXT", node => hasNodeSettings(node));
}


function createGetSentenceCount(
	settings: NodeSettings
): () => number
{
	const {showParagraphs, paraMinSentences, paraMaxSentences} = settings;
	const range = Math.max(0, paraMaxSentences - paraMinSentences);
	const id = [paraMinSentences, range].join("|");

	if (showParagraphs) {
		return getSentenceCountCache[id]
			|| (getSentenceCountCache[id] =
				() => (paraMinSentences + Math.round(Math.random() * range)));
	}

	return getSentenceCountCache["0"];
}


function getAvailableWords(
	visibleText: string,
	storedText: string
): string[]
{
	return splitWords(storedText.slice(visibleText.length));
}


function applyParagraphSettings(
	text: string,
	settings: NodeSettings
): string
{
	let result = text.replace(spaceNewlinePattern, " ");

	if (settings.showParagraphs) {
		const getSentenceCount = createGetSentenceCount(settings);
		let targetSentenceCount = getSentenceCount();
		let currentSentenceCount = 0;

		result = result.replace(periodPattern, () => {
			currentSentenceCount++;

			if (currentSentenceCount % targetSentenceCount == 0) {
				targetSentenceCount = getSentenceCount();
				currentSentenceCount = 0;

					// put a space before the newline so the words on either
					// side will get counted separately
				return ". \n";
			} else {
					// put the period back with a single space after it
				return ". ";
			}
		});
	}

	return result;
}


function updateNodeText(
	node: TextNode,
	defaultSettings: NodeSettings
)
{
	const targetHeight = node.height;

	node.textAutoResize = "HEIGHT";

	let visibleText = node.characters;
	let storedText = node.getPluginData("text") || visibleText;
	let settings: NodeSettings = JSON.parse(node.getPluginData("settings") || "null") || defaultSettings;
	const getSentenceCount = createGetSentenceCount(settings);
	let {height} = node;
	let wordsPerPx = height / getWordCount(visibleText);
// TODO: when the text is empty, getWordCount always returns 1, but we should special case that.  have some other way to calc it
	let heightDelta = targetHeight - height;
	let loops = 0;
//console.log("start", targetHeight, height, heightDelta, wordsPerPx, `|${visibleText}|\n`, `|${storedText}|`);

		// if the text is taller than the target, let it loop more so that it
		// always has a chance to reduce the text to fit
	while ((heightDelta < 0 && loops < 10) || (heightDelta > 3 && loops < 5)) {
		if (heightDelta < 0) {
			visibleText = visibleText
				.split(spacePattern)
				.slice(0, Math.min(-1, Math.round(heightDelta / wordsPerPx)))
				.join(" ");
		} else {
			const targetWordCount = Math.max(1, Math.round(heightDelta / wordsPerPx));
			let newWords = getAvailableWords(visibleText, storedText);
			const newWordCount = newWords.length;

			if (newWordCount < targetWordCount) {
				storedText = appendRandomText(
					storedText,
					targetWordCount - newWordCount,
					getSentenceCount
				);
				newWords = getAvailableWords(visibleText, storedText);
			}

//console.log(loops, "add text",  targetWordCount, newWords.length, newWords);

			visibleText = appendText(visibleText, newWords.slice(0, targetWordCount));
		}
//console.log(loops, heightDelta, visibleText);

		node.characters = visibleText;
		height = node.height;
		wordsPerPx = height / getWordCount(visibleText);
		heightDelta = targetHeight - height;
console.log(loops, "after adding text", targetHeight, height, heightDelta, wordsPerPx);
		loops++;
	}

console.log("=== loop count", loops);
	node.characters = node.characters.trim();
	node.textAutoResize = "NONE";
	node.resize(node.width, targetHeight);
	node.setPluginData("text", storedText);
}


function updateNodeSettings(
	node: TextNode,
	newSettings: NodeSettings
)
{
	let storedText = node.getPluginData("text") || "";
	let settings = getNodeSettings(node);

	if (
		!settings
		|| settings.showParagraphs !== newSettings.showParagraphs
		|| settings.paraMinSentences !== newSettings.paraMinSentences
		|| settings.paraMaxSentences !== newSettings.paraMaxSentences
	) {
		if (!storedText) {
			storedText = getRandomSentence();
		}

		storedText = applyParagraphSettings(storedText, newSettings);
		node.setPluginData("text", storedText);
		node.characters = storedText;
	}

		// adjust the visible text in the node to fit using the updated
		// text and new settings
	setNodeSettings(node, newSettings);
}


function updateNodeRelaunchButtons(
	node: TextNode
)
{
		// show the update relaunch button with no descriptive text
	node.setRelaunchData({ ...relaunchButtons });
}


async function refitTextNodes(
	nodes: TextNode[],
	nodeSettings: NodeSettings
)
{
	for (const node of nodes) {
		if (node.textAutoResize !== "WIDTH_AND_HEIGHT") {
			await loadFontsAsync(node);
			updateNodeText(node, nodeSettings);
		}
	}
}


async function randomizeText(
	nodes: TextNode[])
{
	for (const node of nodes) {
		await loadFontsAsync(node);
		node.characters = "";
		node.setPluginData("text", "");
		updateNodeText(node, settings.nodeSettings);
	}
}


function getNodeSizeHash(
	nodes: LayoutMixin[]
): string
{
	return nodes.map(({
		layoutAlign,
		absoluteRenderBounds,
		width,
		height
	}) => {
			// if a text node is in a frame and stretched to fit the frame, its
			// height will be reported as the frame height, not its actual
			// height, so in that case, use its absoluteRenderBounds.  that will
			// be null if the selected text node is invisible, so fall back to
			// the bounding box width/height in that case.
		const {width: w, height: h} = layoutAlign !== "INHERIT" && absoluteRenderBounds
			? absoluteRenderBounds
			: { width, height };

		return `${w.toFixed(1)}x${h.toFixed(1)}`;
	}).join("|");
}


const handleSettingsChanged = debounce(async (settings: NodeSettings) => {
	if (
		!lastNodeSettings
		|| lastNodeSettings.showParagraphs !== settings.showParagraphs
		|| lastNodeSettings.paraMinSentences !== settings.paraMinSentences
		|| lastNodeSettings.paraMaxSentences !== settings.paraMaxSentences
	) {
		lastNodeSettings = settings;
		await setPluginSettings({ nodeSettings: settings });

// TODO: updating text elements in auto layouts doesn't seem to work?
		for (const node of findInGroups("TEXT")) {
			if (node.textAutoResize !== "WIDTH_AND_HEIGHT") {
				await loadFontsAsync(node);
				updateNodeSettings(node, settings);
				updateNodeText(node, settings);
				updateNodeRelaunchButtons(node);
			}
		}
	}
}, 500);


async function handleSelectionChanged()
{
		// look for text nodes that have already had settings applied to them,
		// so that we don't try to refit non-Lorem Fitem text
	const nodes = getSelectedPlaceholders();
console.log("handleSelectionChanged", nodes.length);

	emit("context:selection", nodes.length);

		// since the selection has changed, clear any pending timer from the
		// previous selection
	clearInterval(selectionTimer);

	if (nodes.length) {
			// since the selection just changed and includes text nodes, update
			// them at least once, even if their size doesn't subsequently change
// TODO: lastNodeSettings may be undefined here for some reason
		await refitTextNodes(nodes, lastNodeSettings);
		lastNodeSizeHash = getNodeSizeHash(nodes);

		selectionTimer = setInterval(async () => {
			const nodeSizeHash = getNodeSizeHash(nodes);

				// only update the selected text nodes if they've actually
				// changed size
			if (nodeSizeHash !== lastNodeSizeHash) {
//console.log("nodeSizeHash", nodeSizeHash, lastNodeSizeHash);
				lastNodeSizeHash = nodeSizeHash;
				await refitTextNodes(nodes, lastNodeSettings);
			}
		}, checkSelectionInterval);
	}
}


async function handleAdd()
{
	const node = figma.createText();
	const {center} = figma.viewport;
	const {nodeSettings} = settings;

	node.x = center.x - 100;
	node.y = center.y - 100;
	node.resize(200, 200);

	await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
	setNodeSettings(node, nodeSettings);
	updateNodeText(node, nodeSettings);
	updateNodeRelaunchButtons(node);
	figma.currentPage.selection = [node];
}


async function handleRandomize()
{
	await randomizeText(getSelectedPlaceholders());
}


export default async function LoremFitem()
{
	settings = await getPluginSettings();

	on("context:settings", handleSettingsChanged);
	on("add", handleAdd);
	on("randomize", handleRandomize);

		// in case there's a debounced call waiting, flush it when the plugin
		// UI is closed
	figma.on("close", () => handleSettingsChanged.flush());

	figma.on("selectionchange", handleSelectionChanged);

	switch (figma.command) {
		case "update":
			await refitTextNodes(selection("TEXT"), settings.nodeSettings);
			figma.closePlugin();
			break;

		case "randomize":
			await randomizeText(getSelectedPlaceholders());
			figma.closePlugin();
			break;

		default:
			showUI(
				{
					width: 270,
					height: 210
				},
				{
					settings: settings.nodeSettings,
					selection: getSelectedPlaceholders().length
				}
			);

				// since we just opened the UI, treat any existing selection
				// as "changed" so that we start the timer to track changes
			await handleSelectionChanged();
			break;
	}
}
