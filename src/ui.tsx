import {render, Container, Text, VerticalSpace} from "@create-figma-plugin/ui"
import {h} from "preact"


function Plugin() {
	return (
		<Container space="medium">
			<VerticalSpace space="medium" />
			<Text>derp</Text>
			<VerticalSpace space="medium" />
		</Container>
	)
}


export default render(Plugin);
