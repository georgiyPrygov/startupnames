import React, { useEffect, useMemo, useState } from "react";
import * as styles from "./MainDomain.module.scss";
import { IMainDomainProps } from "@/components/MainDomain/MainDomain.types";
import Button from "@/components/Button/Button";
import classNames from "classnames";
import { ButtonSize, ButtonStatus } from "@/components/Button/Button.types";
import DomainItem from "@/components/DomainItem/DomainItem";
import { ISingleDomain } from "@/api/availability/availability.types";
import { tldsList } from "@/resources/tldsList";
import { getDomainsAvailability } from "@/api/availability/availability.api";
import DomainSubitem from "@/components/DomainItem/components/DomainSubitem/DomainSubitem";
import { removeTlds } from "@/utils/removeTlds";
import { SVG } from "@/assets/SVG";
import Loader from "@/components/Loader/Loader";

const MainDomain = ({ name, isLoading, isAvailable }: IMainDomainProps) => {

    const [isOpened, setIsOpened] = useState<boolean>(false);
    const [subItems, setSubitems] = useState<ISingleDomain[]>([]);
    const [isLoadingSubitems, setIsLoadingSubitems] = useState<boolean>(false);

    const noTldDomain = useMemo(() => {
        return removeTlds(name);
    }, [name]);

    useEffect(() => {
        if (isOpened) {
            const domainsList = tldsList.map(item => `${noTldDomain}.${item}`);
            setIsLoadingSubitems(true)
            getDomainsAvailability(domainsList)
                .then((res) => setSubitems(res.data.domains))
                .finally(() => setIsLoadingSubitems(false));
        }
    }, [isOpened]);


    const buyUrl = `https://www.domain.com/registration/?flow=domainDFE&search=${name}#/domainDFE/1`;
    const whoisUrl = `https://godaddy.com/whois/results.aspx?domain=${name}`;
    return (
        <div className={classNames(`${styles.main__domain}`, {
            [styles.main__domain_available]: isAvailable
        })}>
            {isLoading ?
                <DomainItem/> :
                <>
                    <div className={styles.main__domain__name}>
                        {name}
                    </div>
                    {
                        isAvailable ?
                            <Button
                                size={ButtonSize.medium}
                                status={ButtonStatus.success}
                                label="Buy"
                                onClick={() => window.open(buyUrl, "_blank")}
                            /> :
                            <Button
                                size={ButtonSize.medium}
                                status={ButtonStatus.error}
                                label="Whois"
                                onClick={() => window.open(whoisUrl, "_blank")}
                            />
                    }
                    <div className={styles.main__domain__show}>
                        <span className={classNames(`${styles.main__domain__show_link}`, {
                            [styles.main__domain__show_link_opened] : isOpened
                        })} onClick={() => setIsOpened(prev => !prev)}>Show more extensions <SVG.ChevronDownIcon/></span>
                        {isOpened &&
                            <div className={styles.main__domain__subitems}>
                                {isLoadingSubitems && <Loader/>}
                                {!!subItems.length && subItems.map(item => {
                                    return <DomainSubitem key={item.domain} item={item}/>;
                                })}
                            </div>
                        }
                    </div>

                </>}


        </div>
    );
};

export default MainDomain;
