import React from "react";
import * as styles from "./DataColumn.module.scss";
import DomainItem from "@/components/DomainItem/DomainItem";

const DataColumn = ({ title, items, isLoading }) => {
    return (
        <div className={styles.data__column}>
            <h2 className={styles.data__column__title}>{title}</h2>
            <div className={styles.data__column__content}>
                {!!items.length ? items.map(item => {
                    return <DomainItem key={item} label={item}/>;
                }) : isLoading ? <>
                    <DomainItem />
                    <DomainItem />
                    <DomainItem />
                    <DomainItem />
                    <DomainItem />
                </> : null}
            </div>
        </div>
    );
};

export default DataColumn;
