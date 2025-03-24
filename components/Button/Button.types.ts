export type ButtonPropsType = {
    label: string;
    onClick: (val: any) => void;
    disabled?: boolean;
    size?: ButtonSize;
    status?: ButtonStatus;
}
export enum ButtonSize {
    small = "small",
    medium = "medium",
    large = "large"
}
export enum ButtonStatus {
    success = "success",
    error = "error",
    default = "default"
}
