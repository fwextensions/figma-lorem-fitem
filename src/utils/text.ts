const spacePattern = / +/g;
const whitespacePattern = /\s+/g;
const trimSpacePattern = /^\s*([\s\S]+?)( *\n)?\s*$/;


export function trimSpaces(
	text: string
): string
{
	return text.replace(trimSpacePattern, "$1");
}


export function splitWords(
	text: string
): string[]
{
	return trimSpaces(text).split(spacePattern);
}


export function getWordCount(
	text: string
): number
{
	return (text.match(whitespacePattern) || "").length + 1;
}


export function appendText(
	text: string,
	newText: string | string[]
): string
{
		// join the array of words, if necessary
	const newTextString = Array.isArray(newText)
		? newText.join(" ")
		: newText;
		// put a space between the existing text and the new text, if necessary
	const connector = whitespacePattern.test(text.slice(-1) + newTextString[0])
		? ""
		: " ";

	return text + connector + newTextString;
}
