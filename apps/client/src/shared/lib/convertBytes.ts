import i18n from '@wireguard-vpn/i18n';

export function convertBytes(bytes: number): string {
    const sizes = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb'];

    if (bytes === 0) {
        return i18n.t('unitValue', {
            value: 0,
            unit: i18n.t('Bytes', { count: 0 }),
        });
    }

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const convertedValue = parseFloat((bytes / Math.pow(1024, i)).toFixed(2));

    return i18n.t('unitValue', {
        value: convertedValue,
        unit: i18n.t(sizes[i]),
    });
}
