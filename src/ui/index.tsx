import { h } from "preact";
import { render } from "@create-figma-plugin/ui";
import Plugin from "./Plugin";
import createPluginContext from "../utils/createPluginContext";


interface PluginContainerProps {
	settings: object,
	selection: number
}

function PluginContainer(
	props: PluginContainerProps)
{
	const {PluginProvider, usePluginContext} = createPluginContext(props);

	return (
		<PluginProvider>
			<Plugin usePluginContext={usePluginContext} />
		</PluginProvider>
	);
}


export default render(PluginContainer);
