export const arabicNumber = (n: number) => {
    const digits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

    if (n < 10) {
        return digits[n];
    }

    if (n < 100) {
        const tens = Math.floor(n / 10);
        const ones = n % 10;
        return digits[tens] + digits[ones];
    }

    // For 3 digits numbers
    const hundreds = Math.floor(n / 100);
    n %= 100;
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    return digits[hundreds] + digits[tens] + digits[ones];
}