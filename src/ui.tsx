import {h} from "preact"
import {useCallback, useState} from "preact/compat";
import {
	render,
	Container,
	Text,
	VerticalSpace,
	Checkbox,
	TextboxNumeric,
    Inline,
    Stack
} from "@create-figma-plugin/ui"
import {ISettings} from "./settings";


interface NumericInputProps {
	label: string,
	value: number,
	disabled: boolean,
	onChange: (value: number) => void
}

function NumericInput({
	label,
	value,
	disabled,
	onChange,
	...props}: NumericInputProps)
{
	const valueString = String(value);

	const handleValueInput = useCallback(
		(valueString: string) => onChange(Number(valueString)),
		[onChange]
	);

	return (
		<Inline space="extraSmall">
			<label
				htmlFor={label}
				style={{
					color: disabled
						? "var(--color-black-30)"
						: "var(--color-black-80)"
				}}
			>
				{label}:
			</label>
			<TextboxNumeric integer
				id={label}
				value={valueString}
				disabled={disabled}
				minimum={1}
				onValueInput={handleValueInput}
				style={{
					width: "5em"
				}}
				{...props}
			/>
		</Inline>
	);
}


interface PluginProps {
	settings: ISettings
}

function Plugin({ settings }: PluginProps) {
	const [showParagraphs, setShowParagraphs] = useState(settings.showParagraphs);
	const [paraMinSentences, setParaMinSentences] = useState(settings.paraMinSentences);
	const [paraMaxSentences, setParaMaxSentences] = useState(settings.paraMaxSentences);

	return (
		<Container space="medium">
			<VerticalSpace space="medium" />
			<Stack space="large">
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
