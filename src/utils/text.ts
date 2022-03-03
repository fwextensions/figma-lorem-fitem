const spacePattern = /\s+/g;

export function getWordCount(
	string: string
): number
{
	return (string.match(spacePattern) || "").length + 1;
}
