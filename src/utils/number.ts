/**
 * 大数字简写格式化
 * 123 → 123
 * 1200 → 1.2K
 * 3000 → 3K
 * 1_250_000 → 1.25M
 * 9_800_000_000 →9.8B
 */
export function formatLargeNumber(num: number): string {
    if (!Number.isFinite(num) || num < 0) return '0';

    const units = [
        { value: 1e9, suffix: 'B' },
        { value: 1e6, suffix: 'M' },
        { value: 1e3, suffix: 'K' },
    ];

    for (const unit of units) {
        if (num >= unit.value) {
            const divided = num / unit.value;
            // 小于10保留1位小数，大于等于10取整数
            if (divided >= 10) {
                return `${Math.round(divided)}${unit.suffix}`;
            } else {
                // 去掉末尾 .0
                const str = divided.toFixed(1);
                return str.endsWith('.0') ? `${Math.round(divided)}${unit.suffix}` : `${str}${unit.suffix}`;
            }
        }
    }
    return String(num);
}