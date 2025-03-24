export const removeTlds = (domain: string) => {
    const hasDot = domain.indexOf(".") > -1;
    return hasDot ? domain.substring(0, domain.indexOf(".")) : domain;
};
