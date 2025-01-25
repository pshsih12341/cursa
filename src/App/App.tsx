import {Provider} from "react-redux";
import store from "./Redux";
import AppRouter from "./Routes";

const App: React.FC = () => {
	return (
		<Provider store={store}>
			<AppRouter />
		</Provider>
	);
};

export default App;
