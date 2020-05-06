const SI_SYMBOL = ['', 'k', 'M', 'B', 'T', 'Qa', 'Qi'];

export const formatBalanceHumanReadable = value => {
    if (!value) {
        return;
    }
    const number = Number(value);

    if (number < 10000) {
        return number.toFixed(2);
    }

    // what tier? (determines SI symbol)
    const tier = (Math.log10(number) / 3) | 0;

    // if zero, we don't need a suffix
    if (tier == 0) {
        return number.toFixed(3);
    }

    // get suffix and determine scale
    const suffix = SI_SYMBOL[tier];
    const scale = Math.pow(10, tier * 3);

    // scale the number
    const scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(2) + '\u00a0' + suffix;
};

export const formatBalance = value => {
    if (!value) {
        return;
    }
    return Number(value).toFixed(3).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1\u00a0');
};
