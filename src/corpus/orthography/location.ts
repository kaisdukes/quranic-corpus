export type Location = number[];

export const parseLocation = (location: string): Location => location.split(':').map(Number)

export const parseHashLocation = (hash: string): Location | undefined => {
    if (hash.charAt(0) != '#') return undefined;
    const [a, b, c] = parseLocation(hash.substring(1));
    return [a, b, c].every(val => !isNaN(val)) ? [a, b, c] : undefined;
}

export const formatLocation = (location: Location) => location.join(':')
export const formatLocationWithBrackets = (location: Location) => `(${formatLocation(location)})`