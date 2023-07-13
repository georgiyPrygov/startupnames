import { NextPage } from "next";
import * as styles from "../styles/home.module.scss";
import React, { useEffect, useMemo, useState } from "react";
import { IKeywordOption } from "@/types/Search.types";
import Button from "@/components/Button/Button";
import DataColumn from "@/components/DataColumn/DataColumn";
import CreatableMultiselect from "@/components/CreatableMultiselect/CreatableMultiselect";
import { combinateWords } from "@/utils/wordsCombinator";
import { isDomain } from "@/utils/isDomainVerify";
import MainDomain from "@/components/MainDomain/MainDomain";
import { getSingleDomainAvailability } from "@/api/availability/availability.api";
import { ButtonSize } from "@/components/Button/Button.types";
import { ISingleDomain } from "@/api/availability/availability.types";
import { generateFirstResults } from "@/api/generator/generator.api";
import { trimmTextToArray } from "@/utils/aiResultsTrimmer";
import { keywordsOptions } from "@/resources/keywordsOptions";
import { removeTlds } from "@/utils/removeTlds";


const Home: NextPage = () => {

        const [selectedKeywords, setSelectedKeywords] = useState<IKeywordOption[]>([]);
        const [searchResults, setSearchResults] = useState<string[]>([]);
        const [isGenerated, setIsGenerated] = useState<boolean>(false);
        const [isGenerating, setIsGenerating] = useState<boolean>(false);
        const [singleDomainLoading, setSingleDomainLoading] = useState<boolean>(false);
        const [obviousOptions, setObviousOptions] = useState<ISingleDomain[]>([]);
        const [singleDomain, setSingleDomain] = useState<ISingleDomain>({ domain: "", available: false });


        const setSelectOnChange = (options: IKeywordOption[]) => {
            setSelectedKeywords(options);
        };

        //Convert options to array of values
        const keywordsValues = useMemo(() => {
            return selectedKeywords.map(item => item.value);
        }, [selectedKeywords]);

        //Check if array of values contains domains and returns array with domains
        const keywordsContainDomain = useMemo(() => {
            return keywordsValues.filter(item => isDomain(item));
        }, [keywordsValues]);

        // Check if array has no domains
        const noDomainKeywords = useMemo(() => {
            return keywordsValues.filter(item => !isDomain(item));
        }, [keywordsValues]);

        const requestAllDomains = (options: string[]) => {

            setIsGenerated(false);
            setIsGenerating(false);
            setSingleDomain({ domain: "", available: false });
            setObviousOptions([]);


            // Generate instant results from non-domain options only
            if (keywordsValues.length > 1) {
                const filteredFromDomains = options.filter(item => !isDomain(item));
                setObviousOptions(combinateWords(filteredFromDomains));
            }

            // Show single domain block with first domain even if multiple keywords chosen
            if (keywordsValues.length > 1 && keywordsContainDomain.length) {
                setSingleDomain({ ...singleDomain, domain: keywordsContainDomain[0] });
            }

            // Show single domain when only one keyword is chosen
            if (keywordsValues.length === 1) {
                isDomain(keywordsValues[0]) ? setSingleDomain({
                    ...singleDomain,
                    domain: keywordsValues[0]
                }) : setSingleDomain({ ...singleDomain, domain: keywordsValues[0] + ".com" });
            }

            // Run AI generator
            if (noDomainKeywords.length) {
                setIsGenerated(true);
                setIsGenerating(true);
                setSearchResults([]);
                generateFirstResults(noDomainKeywords)
                    .then((res => {
                            setSearchResults(JSON.parse(trimmTextToArray(res.data.choices[0].text)).map(item => removeTlds(item)));
                        }
                    ))
                    .finally(() => setIsGenerating(false));
            }
        };


        useEffect(() => {
            if (singleDomain.domain) {
                setSingleDomainLoading(true);
                getSingleDomainAvailability(singleDomain.domain).then((res) => setSingleDomain({
                    domain: res.data.domains[0].domain,
                    available: res.data.domains[0].available
                })).finally(() => setSingleDomainLoading(false));
            }
        }, [singleDomain.domain]);


        return (<>
                <div className={styles.main__title}>
                    <h1>AI based<br/> domain names generator</h1>
                    <p>Get suggestions for your startup domain and check it's availability</p>
                </div>
                <div className={styles.main__search}>
                    <CreatableMultiselect
                        options={keywordsOptions}
                        selectedValues={selectedKeywords}
                        setValueOnChange={setSelectOnChange}
                    />
                    <Button
                        label="Generate"
                        size={ButtonSize.large}
                        onClick={() => {
                            requestAllDomains(keywordsValues);
                        }}
                        disabled={!keywordsValues.length}
                    />
                </div>
                {!!singleDomain.domain &&
                    <MainDomain
                        name={singleDomain.domain}
                        isLoading={singleDomainLoading}
                        isAvailable={singleDomain.available}
                    />
                }
                {!!obviousOptions.length && <DataColumn title="Instant results" items={obviousOptions}/>}
                {isGenerated && <DataColumn title="AI Suggestions" items={searchResults} isLoading={isGenerating}/>}
            </>
        );
    }
;


export default Home;
