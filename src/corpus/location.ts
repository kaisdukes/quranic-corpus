export type Location = number[];

export const formatLocation = (location: Location) => `(${location.join(':')})`