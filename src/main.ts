import {loadSettingsAsync, showUI} from "@create-figma-plugin/utilities";
import {loadFontsAsync, selection} from "./utils/plugin";
import {appendRandomText} from "./sentences"
import {appendText, getWordCount, splitWords} from "./utils/text";
import {ISettings} from "./settings";


const spacePattern = / +/;
const getSentenceCountCache: Record<number, () => number> = {
	0: () => 0
};


function createGetSentenceCount(
	settings: ISettings
): () => number
{
	const {showParagraphs, paraMinSentences, paraMaxSentences} = settings;
	const range = Math.max(0, paraMaxSentences - paraMinSentences);

	if (showParagraphs) {
		return getSentenceCountCache[range]
			|| (getSentenceCountCache[range] =
				() => paraMinSentences + Math.round(Math.random() * range));
	}

	return getSentenceCountCache[0];
}


function getAvailableWords(
	visibleText: string,
	storedText: string
): string[]
{
	return splitWords(storedText.slice(visibleText.length));
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
console.log("start", targetHeight, height, heightDelta, wordsPerPx, `|${visibleText}|`, `|${storedText}|`);

	while (Math.abs(heightDelta) > 0 && loops < 10) {
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

console.log(loops, "add text",  targetWordCount, newWords.length, newWords);

			visibleText = appendText(visibleText, newWords.slice(0, targetWordCount));
		} else {
			break;
		}
console.log(loops, heightDelta, visibleText);

		node.characters = visibleText;
		height = node.height;
		wordsPerPx = height / getWordCount(visibleText);
		heightDelta = targetHeight - height;
console.log(loops, "after adding text", heightDelta, wordsPerPx);
		loops++;
	}

	node.characters = node.characters.trim();
	node.textAutoResize = "NONE";
	node.resize(node.width, targetHeight);
	node.setPluginData("text", storedText);

		// show the update relaunch button with no descriptive text
	node.setRelaunchData({ update: "" });
}


export default async function LoremFitem()
{
	const textNodes = selection("TEXT") as TextNode[];
	const settings = await loadSettingsAsync({
		showParagraphs: true,
		paraMinSentences: 2,
		paraMaxSentences: 5
	});
console.log(settings);

	for (const node of textNodes) {
		await loadFontsAsync(node);
const t = Date.now();
		fillWithText(node, settings);
console.log(Date.now() - t);
	}

//figma.closePlugin();

	showUI({}, { settings });
}
