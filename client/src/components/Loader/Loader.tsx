import React from "react";
import * as styles from "./Loader.module.scss"
import { ILoaderProps } from "@/components/Loader/Loader.types";

const Loader = ({text}: ILoaderProps) => {
    return (
        <div className={styles.loader__container}>
            <div className={styles.lds__ring}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
            </div>
        </div>
    );
};

export default Loader;
