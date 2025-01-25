import {HashRouter as Router, Routes, Route} from "react-router-dom";
import Layout from "../widgets/Layout";
import HomePage from "Pages/Home";

const AppRouter: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Layout />}>
					<Route path='/' element={<HomePage />} />
				</Route>
			</Routes>
		</Router>
	);
};

export default AppRouter;
