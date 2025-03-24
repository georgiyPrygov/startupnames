import React, { useEffect, useState } from "react";
import styles from "./DomainItem.module.scss";
import { IDomainItemProps } from "@/components/DomainItem/DomainItem.types";
import { ISingleDomain } from "@/services/availability/availability.types";
import { tldsList } from "@/resources/tldsList";
import { getDomainsAvailability } from "@/services/availability/availability.api";
import DomainSubitem from "@/components/DomainItem/components/DomainSubitem/DomainSubitem";
import { SVG } from "@/assets/SVG";
import classNames from "classnames";
import Loader from "@/components/Loader/Loader";

const DomainItem = ({ label }: IDomainItemProps) => {

    const [isOpened, setIsOpened] = useState<boolean>(false);
    const [subItems, setSubitems] = useState<ISingleDomain[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (isOpened) {
            const domainsList = tldsList.map(item => `${label}.${item}`);
            setIsLoading(true);
            getDomainsAvailability(domainsList)
                .then((res) => setSubitems(res.data.domains))
                .finally(() => setIsLoading(false));
        }
    }, [isOpened]);

    return (
        <div className={styles.domain__item}>
            {label
                ?
                <span className={classNames(`${styles.domain__item__title}`, {
                    [styles.domain__item__title_opened]: isOpened
                })} onClick={() => setIsOpened(prev => !prev)}>{label} <SVG.ChevronDownIcon/></span>
                :
                <div className={styles.domain__item__preloader}></div>
            }
            {isOpened &&
                <div className={styles.domain__item__subitems}>
                    {isLoading && <Loader/>}
                    {!!subItems.length && subItems.map(item => {
                        return <DomainSubitem key={item.domain} item={item}/>;
                    })}
                </div>
            }
        </div>
    );
};

export default DomainItem;
