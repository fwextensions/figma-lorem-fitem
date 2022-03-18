import {loadSettingsAsync, on, showUI} from "@create-figma-plugin/utilities";
import {loadFontsAsync, selection} from "../utils/plugin";
import {appendRandomText, getRandomSentence} from "./sentences"
import {appendText, getWordCount, splitWords} from "../utils/text";
import {getNodeSettings, ISettings, setNodeSettings} from "../utils/settings";


const spacePattern = / +/;
const spaceNewlinePattern = / *\n+/g;
const periodPattern = /\.\s*/g;
const getSentenceCountCache: Record<string, () => number> = {
	"0": () => 0
};


function createGetSentenceCount(
	settings: ISettings
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
	settings: ISettings
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


function fillWithText(
	node: TextNode,
	defaultSettings: ISettings
)
{
	const targetHeight = node.height;

	node.textAutoResize = "HEIGHT";

	let visibleText = node.characters;
	let storedText = node.getPluginData("text") || visibleText;
	let settings: ISettings = JSON.parse(node.getPluginData("settings") || "null") || defaultSettings;
	const getSentenceCount = createGetSentenceCount(settings);
	let {height} = node;
	let wordsPerPx = height / getWordCount(visibleText);
// TODO: when the text is empty, getWordCount always returns 1, but we should special case that.  have some other way to calc it
	let heightDelta = targetHeight - height;
	let alreadyReducedText = false;
	let loops = 0;
//console.log("start", targetHeight, height, heightDelta, wordsPerPx, `|${visibleText}|\n`, `|${storedText}|`);

	while (heightDelta !== 0 && loops < 5) {
		if (heightDelta < 0) {
				// keep track of having already cut down the text, so we don't
				// ping pong back and forth across the target height
			alreadyReducedText = true;
			visibleText = visibleText
				.split(spacePattern)
				.slice(0, Math.min(-1, Math.round(heightDelta / wordsPerPx)))
				.join(" ");
		} else if (!alreadyReducedText) {
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
		} else {
			break;
		}
//console.log(loops, heightDelta, visibleText);

		node.characters = visibleText;
		height = node.height;
		wordsPerPx = height / getWordCount(visibleText);
		heightDelta = targetHeight - height;
console.log(loops, "after adding text", heightDelta, wordsPerPx);
		loops++;
	}

console.log("=== loop count", loops);
	node.characters = node.characters.trim();
	node.textAutoResize = "NONE";
	node.resize(node.width, targetHeight);
	node.setPluginData("text", storedText);

		// show the update relaunch button with no descriptive text
	node.setRelaunchData({ update: "" });
}


function updateNodeSettings(
	node: TextNode,
	newSettings: ISettings
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


export default async function LoremFitem()
{
	const settings = await loadSettingsAsync({
		showParagraphs: true,
		paraMinSentences: 2,
		paraMaxSentences: 5
	});
	const textNodes = selection("TEXT") as TextNode[];
console.log(figma.command);

	on("settingsChanged", async (settings: ISettings) => {
		for (const node of selection("TEXT") as TextNode[]) {
			await loadFontsAsync(node);
			updateNodeSettings(node, settings);
			fillWithText(node, settings);
		}
	});

	for (const node of textNodes) {
		await loadFontsAsync(node);
const t = Date.now();
		fillWithText(node, settings);
console.log(Date.now() - t);
	}


	if (!figma.command) {
		showUI({}, { settings });
	} else {
		figma.closePlugin();
	}
}
