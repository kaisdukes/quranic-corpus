export const combineClassNames = (...classNames: (string | undefined)[]) => {
    return classNames.filter(name => name !== undefined).join(' ');
}