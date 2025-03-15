/* eslint-disable no-undef */
import {Provider} from "react-redux";
import store from "./Redux";
import AppRouter from "./Routes";
import "../shared/styles/AppStyles.scss";

const App = () => {

	return (
		<Provider store={store}>
			<AppRouter />
		</Provider>
	);
};

export default App;
