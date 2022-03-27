import {h} from "preact"
import {emit, on} from "@create-figma-plugin/utilities";
import {createContext} from "preact";
import {useContext, useMemo, useReducer} from "preact/compat";


interface StateKeyValue {
	key: string,
	value: any
}


const event = (key: string) => `context:${key}`;


function pluginReducer(
	state: object,
	{
		key,
		value
	}: StateKeyValue)
{
	if (!(key in state)) {
		throw new Error(`pluginReducer: unrecognized state key: ${key}`);
	}

	return {
		...state,
		[key]: value
	};
}


export default function createPluginContext<T>(
	initialState: T
)
//): { PluginProvider: PreactProvider<T>, usePluginContext: () => { state: T, dispatch: (kv: StateKeyValue) => void } }
{
	const PluginContext = createContext(initialState);

	const PluginProvider = (props: any) => {
		const [state, dispatch] = useReducer(pluginReducer, { ...initialState });
		const dispatchAndEmit = ({key, value}: StateKeyValue) => {
			dispatch({ key, value });
			emit(event(key), value);
		};
		const context = useMemo(() => ({
			state,
			dispatch: dispatchAndEmit
		}), [state, dispatch]);

		for (const key of Object.keys(initialState)) {
			on(event(key), (value: any) => dispatch({ key, value }));
		}

		return (
			<PluginContext.Provider value={context} {...props} />
		);
	};

	const usePluginContext = () => {
		const context = useContext(PluginContext);

		if (context === undefined) {
			throw new Error('usePluginContext() must be used within a PluginProvider.');
		}

		return context;
	};

	return {
		PluginProvider,
		usePluginContext
	};
}
