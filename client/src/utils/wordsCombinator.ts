export const combinateWords = (words: string[]) => {
    const combinations = [];

    for (let i = 0; i < words.length; i++) {
        for (let j = 0; j < words.length; j++) {
            if (i !== j) {
                const combination = words[i] + words[j];
                combinations.push(combination);
            }
        }
    }
    return combinations;
}
