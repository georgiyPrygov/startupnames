import React from "react";
import * as styles from "./Button.module.scss";
import { ButtonPropsType, ButtonSize, ButtonStatus } from "@/components/Button/Button.types";
import classNames from "classnames";

const Button = ({ label, onClick, disabled, size = ButtonSize.medium, status = ButtonStatus.default }: ButtonPropsType) => {
    return (
        <button className={classNames(`${styles.button__primary}`, {
            [styles.button__primary_small]: size === ButtonSize.small,
            [styles.button__primary_medium]: size === ButtonSize.medium,
            [styles.button__primary_large]: size === ButtonSize.large,
            [styles.button__primary_error]: status === ButtonStatus.error,
            [styles.button__primary_success]: status === ButtonStatus.success,
            [styles.button__primary_default]: status === ButtonStatus.default,
        })} aria-label={label} onClick={onClick} disabled={disabled}>
            {label}
        </button>
    );
};

export default Button;
