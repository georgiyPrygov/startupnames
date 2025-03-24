import { IKeywordOption } from "@/types/Search.types";

export interface ICreatableMultiselectProps {
    options: IKeywordOption[];
    setValueOnChange: (options: IKeywordOption[]) => void;
    selectedValues: IKeywordOption[];
}
