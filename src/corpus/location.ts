export type Location = number[];

export const formatLocation = (location: Location) => location.join(':')
export const formatLocationWithBrackets = (location: Location) => `(${formatLocation(location)})`