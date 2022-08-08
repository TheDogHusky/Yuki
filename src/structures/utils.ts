class Utils {
    public static isValidHEX(hex: string) {
        const filter = /^#[0-9A-F]{6}$/i;
        return filter.test(hex);
    };
};


export default Utils;