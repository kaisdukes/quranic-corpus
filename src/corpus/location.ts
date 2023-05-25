export type Location = number[];

export const parseLocation = (location: string): Location => location.split(':').map(Number)
export const formatLocation = (location: Location) => location.join(':')
export const formatLocationWithBrackets = (location: Location) => `(${formatLocation(location)})`