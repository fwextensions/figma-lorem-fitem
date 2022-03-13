import {h} from "preact";
import {useCallback} from "preact/compat";
import {Inline, TextboxNumeric} from "@create-figma-plugin/ui";

interface NumericInputProps {
	label: string,
	value: number,
	disabled: boolean,
	onChange: (value: number) => void
}

export function NumericInput({
	label,
	value,
	disabled,
	onChange,
	...props
}: NumericInputProps)
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
