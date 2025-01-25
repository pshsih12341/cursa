import React from "react";
import {Outlet} from "react-router-dom";
import styles from "./styles.module.scss";

const Layout: React.FC = () => {
	return (
		<div className={styles.container}>
			<Outlet />
			<div className={styles.footer}></div>
		</div>
	);
};

export default React.memo(Layout);
