import React from "react";
import styles from "./style.module.scss";

const Page = ({children}) => {
	return <div className={styles.page}>{children}</div>;
};

export default React.memo(Page);
