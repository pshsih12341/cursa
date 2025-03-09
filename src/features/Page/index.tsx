import React from "react";
import classNames from "classnames";

import styles from "./style.module.scss";

const Page: React.FC<{className?: string; children?: React.ReactNode}> = ({className, children}) => {
	return <div className={classNames(styles.page, className)}>{children}</div>;
};

export default React.memo(Page);
