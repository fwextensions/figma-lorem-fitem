import {h} from "preact"
import {useEffect, useState} from "preact/compat";
import {
	Checkbox,
	Container,
	Inline,
	render,
	Stack,
	Text,
	VerticalSpace
} from "@create-figma-plugin/ui"
import {emit} from "@create-figma-plugin/utilities";
import {NodeSettings} from "../utils/settings";
import {NumericInput} from "./NumericInput";


interface PluginProps {
	settings: NodeSettings
}

function Plugin({ settings }: PluginProps) {
	const [showParagraphs, setShowParagraphs] = useState(settings.showParagraphs);
	const [paraMinSentences, setParaMinSentences] = useState(settings.paraMinSentences);
	const [paraMaxSentences, setParaMaxSentences] = useState(settings.paraMaxSentences);

	useEffect(() => {
		emit("settingsChanged", {
			showParagraphs,
			paraMinSentences,
			paraMaxSentences
		});
	}, [showParagraphs, paraMinSentences, paraMaxSentences]);

	return (
		<Container space="medium">
			<VerticalSpace space="medium" />
			<Stack space="medium">
				<Checkbox
					value={showParagraphs}
					onValueChange={setShowParagraphs}
				>
					<Text>Show paragraphs</Text>
				</Checkbox>
				<Stack space="small"
					style={{ paddingLeft: "20px" }}
				>
					<Text muted={!showParagraphs}>
						Sentences per paragraph:
					</Text>
					<Inline space="large">
						<NumericInput
							label="Min"
							value={paraMinSentences}
							disabled={!showParagraphs}
							onChange={setParaMinSentences}
						/>
						<NumericInput
							label="Max"
							value={paraMaxSentences}
							disabled={!showParagraphs}
							onChange={setParaMaxSentences}
						/>
					</Inline>
				</Stack>
			</Stack>
			<VerticalSpace space="medium" />
		</Container>
	)
}


export default render(Plugin);
