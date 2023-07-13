import React from "react";
import { IDomainSubitemProps } from "@/components/DomainItem/components/DomainSubitem/DomainSubitem.types";
import Button from "@/components/Button/Button";
import { ButtonSize, ButtonStatus } from "@/components/Button/Button.types";
import * as styles from "./DomainSubitem.module.scss";

const DomainSubitem = ({ item }: IDomainSubitemProps) => {

    const buyUrl = `https://www.domain.com/registration/?flow=domainDFE&search=${item.domain}#/domainDFE/1`;
    const whoisUrl = `https://godaddy.com/whois/results.aspx?domain=${item.domain}`;

    return (
        <div className={styles.domain__subitem}
             onClick={() => window.open(`${item.available ? buyUrl : whoisUrl}`, "_blank")}>
            {item.domain}
            {item.available ?
                <Button
                    size={ButtonSize.small}
                    status={ButtonStatus.success}
                    label="Buy"
                    onClick={() => window.open(buyUrl, "_blank")}
                /> :
                <Button size={ButtonSize.small} status={ButtonStatus.error} label="Whois"
                        onClick={() => window.open(whoisUrl, "_blank")}/>}
        </div>
    );
};

export default DomainSubitem;
