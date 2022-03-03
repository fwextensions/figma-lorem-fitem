import {showUI} from "@create-figma-plugin/utilities";
import {loadFontsAsync, selection} from "./utils/plugin";
import {getRandomtext} from "./sentences"
import {getWordCount} from "./utils/text";


const spacePattern = / +/;


function fillWithText(
	node: TextNode)
{
	const targetHeight = node.height;

	node.textAutoResize = "HEIGHT";

	const initialText = node.characters;
	let text = initialText;
	let {height} = node;
	let wordsPerPx = height / getWordCount(initialText);
	let heightDelta = targetHeight - height;
	let loops = 0;

	while (Math.abs(heightDelta) > 3 && loops < 10) {
		if (heightDelta < 0) {
			text = text
				.split(spacePattern)
				.slice(0, Math.min(-1, Math.round(heightDelta / wordsPerPx)))
				.join(" ");
		} else {
			const targetWordCount = Math.max(1, Math.round(heightDelta / wordsPerPx));
			const newText = getRandomtext(targetWordCount);
			const newWords = newText.split(spacePattern);

			text += newWords.slice(0, targetWordCount).join(" ");
		}

		node.characters = text;
		height = node.height;
		wordsPerPx = height / getWordCount(text);
		heightDelta = targetHeight - height;
		loops++;
	}

	node.characters = node.characters.trim();
	node.textAutoResize = "NONE";
	node.resize(node.width, targetHeight);
}


export default async function LoremFitem()
{
	const textNodes = selection("TEXT") as TextNode[];
	let node: TextNode;

	for (node of textNodes) {
		await loadFontsAsync(node);
		fillWithText(node);
	}

	figma.closePlugin();

	showUI({});
}
