import {h} from "preact"
import {useState} from "preact/compat";
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


interface NumericInputProps {
	label: string,
	value: string,
	disabled: boolean,
	onChange: (value: string) => void
}

function NumericInput({
	label,
	value,
	disabled,
	onChange,
	...props}: NumericInputProps)
{
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
				value={value}
				disabled={disabled}
				minimum={1}
				onValueInput={onChange}
				style={{
					width: "5em"
				}}
				{...props}
			/>
		</Inline>
	);
}


function Plugin() {
	const [showParagraphs, setShowParagraphs] = useState(false);
	const [paraMinSentences, setParaMinSentences] = useState("2");
	const [paraMaxSentences, setParaMaxSentences] = useState("4");

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
