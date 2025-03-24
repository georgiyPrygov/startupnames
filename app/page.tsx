'use client';

import styles from "@/styles/home.module.scss";
import { useEffect, useMemo, useState, useCallback } from "react";
import { IKeywordOption } from "@/types/Search.types";
import Button from "@/components/Button/Button";
import DataColumn from "@/components/DataColumn/DataColumn";
import CreatableMultiselect from "@/components/CreatableMultiselect/CreatableMultiselect";
import { combinateWords } from "@/utils/wordsCombinator";
import { isDomain } from "@/utils/isDomainVerify";
import MainDomain from "@/components/MainDomain/MainDomain";
import { getSingleDomainAvailability } from "@/services/availability/availability.api";
import { ButtonSize } from "@/components/Button/Button.types";
import { ISingleDomain } from "@/services/availability/availability.types";
import { generateFirstResults } from "@/services/generator/generator.api";
import { trimmTextToArray } from "@/utils/aiResultsTrimmer";
import { keywordsOptions } from "@/resources/keywordsOptions";
import { removeTlds } from "@/utils/removeTlds";

export default function Home() {
    const [selectedKeywords, setSelectedKeywords] = useState<IKeywordOption[]>([]);
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [isGenerated, setIsGenerated] = useState<boolean>(false);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [singleDomainLoading, setSingleDomainLoading] = useState<boolean>(false);
    const [obviousOptions, setObviousOptions] = useState<ISingleDomain[]>([]);
    const [singleDomain, setSingleDomain] = useState<ISingleDomain>({ domain: "", available: false });
    const [error, setError] = useState<string | null>(null);

    const setSelectOnChange = useCallback((options: IKeywordOption[]) => {
        setSelectedKeywords(options);
        setError(null);
    }, []);

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

    const requestAllDomains = useCallback((options: string[]) => {
        if (options.length === 0) {
            setError("Please enter at least one keyword");
            return;
        }

        setError(null);
        setIsGenerated(false);
        setIsGenerating(false);
        setSingleDomain({ domain: "", available: false });
        setObviousOptions([]);

        // Generate instant results from non-domain options only
        if (keywordsValues.length > 1) {
            const filteredFromDomains = options.filter(item => !isDomain(item));
            // Convert string[] to ISingleDomain[]
            const combinedDomains = combinateWords(filteredFromDomains).map((domain: string) => ({
                domain,
                available: false
            }));
            setObviousOptions(combinedDomains);
        }

        // Show single domain block with first domain even if multiple keywords chosen
        if (keywordsValues.length > 1 && keywordsContainDomain.length) {
            setSingleDomain({ ...singleDomain, domain: keywordsContainDomain[0] });
        }

        // Show single domain when only one keyword is chosen
        if (keywordsValues.length === 1) {
            isDomain(keywordsValues[0]) 
                ? setSingleDomain({
                    ...singleDomain,
                    domain: keywordsValues[0]
                  }) 
                : setSingleDomain({ 
                    ...singleDomain, 
                    domain: keywordsValues[0] + ".com" 
                  });
        }

        // Run AI generator
        if (noDomainKeywords.length) {
            setIsGenerated(true);
            setIsGenerating(true);
            setSearchResults([]);
            
            generateFirstResults(noDomainKeywords)
                .then((res) => {
                    try {
                        const text = res.data.choices[0].text;
                        const trimmedText = trimmTextToArray(text);
                        const parsedResults = JSON.parse(trimmedText);
                        setSearchResults(
                            parsedResults.map((item: string) => removeTlds(item))
                        );
                        setIsGenerating(false);
                    } catch (error) {
                        setError('Error parsing AI results');
                        console.error('Error parsing data:', error);
                        setSearchResults([]);
                        setIsGenerating(false);
                    }
                })
                .catch((error) => {
                    console.error('API error:', error);
                    setIsGenerating(false);
                    
                    // Show more specific error messages
                    if (error.response) {
                        const status = error.response.status;
                        if (status === 429) {
                            setError('Rate limit exceeded. Please try again after a few minutes or try with fewer keywords.');
                        } else if (error.response.data && error.response.data.message) {
                            setError(error.response.data.message);
                        } else {
                            setError('Error connecting to AI service');
                        }
                    } else {
                        setError('Network error. Please check your connection and try again.');
                    }
                });
        }
    }, [keywordsValues, keywordsContainDomain, noDomainKeywords, singleDomain]);

    useEffect(() => {
        if (singleDomain.domain) {
            setSingleDomainLoading(true);
            getSingleDomainAvailability(singleDomain.domain)
                .then((res) => {
                    if (res.data.domains && res.data.domains.length > 0) {
                        setSingleDomain({
                            domain: res.data.domains[0].domain,
                            available: res.data.domains[0].available
                        });
                    } else {
                        throw new Error('No domain data returned');
                    }
                })
                .catch(error => {
                    console.error('Error checking domain availability:', error);
                    setError("Failed to check domain availability. Please try again.");
                    setSingleDomain({
                        ...singleDomain,
                        available: false
                    });
                })
                .finally(() => setSingleDomainLoading(false));
        }
    }, [singleDomain.domain]);

    return (
        <main className={styles.main}>
            <div className={styles.main__title}>
                <h1>AI based<br/> domain names generator</h1>
                <p>Get suggestions for your startup domain and check it&#39;s availability</p>
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
                    onClick={() => requestAllDomains(keywordsValues)}
                    disabled={!keywordsValues.length}
                />
            </div>
            
            {error && (
                <div className={styles.error}>
                    <p>{error}</p>
                </div>
            )}
            
            {!!singleDomain.domain && (
                <MainDomain
                    name={singleDomain.domain}
                    isLoading={singleDomainLoading}
                    isAvailable={singleDomain.available}
                />
            )}
            
            {!!obviousOptions.length && (
                <DataColumn 
                    title="Instant results" 
                    items={obviousOptions.map(item => item.domain)} 
                    isLoading={false}
                />
            )}
            
            {isGenerated && (
                <DataColumn 
                    title="AI Suggestions" 
                    items={searchResults} 
                    isLoading={isGenerating}
                />
            )}
        </main>
    );
} 