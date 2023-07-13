import React from "react";
import { IKeywordOption } from "@/types/Search.types";
import CreatableSelect from "react-select/creatable";
import styles from "./CreatableMultiselect.module.scss";
import { ICreatableMultiselectProps } from "@/components/CreatableMultiselect/CreatableMultiselect.types";

const CreatableMultiselect = ({ options, setValueOnChange, selectedValues }: ICreatableMultiselectProps) => {

    const onSelectChange = (allOptions: IKeywordOption[], action) => {
        switch (action.action) {
            case "create-option":
                if (action.option !== null) {
                    setValueOnChange([...selectedValues, action.option]);
                }
                break;
            case "select-option":
                if (action.option !== null) {
                    setValueOnChange([...selectedValues, action.option]);
                }
                break;
            case "remove-value":
                setValueOnChange(selectedValues.filter((item) => item.value !== action.removedValue.value));
                break;
            case "clear":
                setValueOnChange([]);
                break;
            default:
                break;
        }
    };

    return (
        <div className={styles.creatable__multiselect}>
            <CreatableSelect
                styles={{
                    container: (baseStyles) => ({
                        ...baseStyles,
                        height: "100%",
                    }),
                    control: (baseStyles) => ({
                        ...baseStyles,
                        height: "100%",
                    }),
                }}
                isClearable
                isMulti
                placeholder="Enter keywords related to your brand or full domain name"
                options={options}
                formatCreateLabel={(userInput) => `Add keyword: ${userInput}`}
                onChange={onSelectChange}
                value={selectedValues}
            />
        </div>
    );
};

export default CreatableMultiselect;
