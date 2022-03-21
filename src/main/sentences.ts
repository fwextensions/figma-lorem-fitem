import {appendText, getWordCount, trimSpaces} from "../utils/text";
import sentences from "../text/loremIpsum";


const periodPattern = /\./g;
const zeroLength = "";


export function getRandomSentence(): string
{
	return sentences[Math.floor(Math.random() * sentences.length)];
}


export function appendRandomText(
	text: string,
	targetWordCount: number,
	getSentenceCount: () => number = () => 0
): string
{
	let newWordCount = 0;
	let newText = "";
	let sentencesInPara = 0;
	let targetSentenceCount = getSentenceCount();
	let lastReturnIndex = text.lastIndexOf("\n");

		// if the last return is at the end of the string, we can skip this
		// block, since sentencesInPara will be 0
	if (targetSentenceCount && lastReturnIndex !== text.length - 1) {
		const currentParaText = text.slice(Math.max(0, lastReturnIndex));

		sentencesInPara = (currentParaText.match(periodPattern) || zeroLength).length;
	}
//console.log("appendRandomText", sentencesInPara, sentencesInPara % targetSentenceCount, text);

	while (newWordCount < targetWordCount) {
		const newSentence = getRandomSentence();
		let connector = " ";

		if (sentencesInPara % targetSentenceCount === 0) {
				// put a space before the newline so that when the text is split
				// on spaces, the words on either side of the newline will be
				// separated
			connector = " \n";
			sentencesInPara = 1;
			targetSentenceCount = getSentenceCount();
		} else {
			sentencesInPara++;
		}

		newText += connector + newSentence;
		newWordCount += getWordCount(newSentence);
	}
//console.log("appendRandomText", newWordCount, newText.replace(/\n/g, "|||\n"));

	newText = appendText(text, newText);
//console.log("appendRandomText after append", newText.replace(/\n/g, "|||\n"));

		// we don't just call .trim() on the string because we wouldn't want to
		// trim a return that might be at the end of the string
	return trimSpaces(newText);
}
