/**
 * ESC/POS Command Constants for 58mm Thermal Printers
 */
export const ESCPOS = {
    // Global
    INIT: new Uint8Array([0x1b, 0x40]),
    FEED_CONTROL_SEQUENCES: {
        LF: new Uint8Array([0x0a]), // Print and line feed
        CR: new Uint8Array([0x0d]), // Print and carriage return
    },

    // Justification
    ALIGN: {
        LEFT: new Uint8Array([0x1b, 0x61, 0x00]),
        CENTER: new Uint8Array([0x1b, 0x61, 0x01]),
        RIGHT: new Uint8Array([0x1b, 0x61, 0x02]),
    },

    // Text format
    TEXT_FORMAT: {
        BOLD_ON: new Uint8Array([0x1b, 0x45, 0x01]),
        BOLD_OFF: new Uint8Array([0x1b, 0x45, 0x00]),
        NORMAL: new Uint8Array([0x1b, 0x21, 0x00]),
        DOUBLE_HEIGHT: new Uint8Array([0x1b, 0x21, 0x10]),
        DOUBLE_WIDTH: new Uint8Array([0x1b, 0x21, 0x20]),
        LARGE: new Uint8Array([0x1b, 0x21, 0x30]),
    },

    // Paper
    PAPER: {
        FULL_CUT: new Uint8Array([0x1d, 0x56, 0x00]),
        PART_CUT: new Uint8Array([0x1d, 0x56, 0x01]),
        FEED_AND_CUT: new Uint8Array([0x1d, 0x56, 0x42, 0x00]), // Feed 0 lines and cut
    }
};

/**
 * Text encoding for Turkish characters (Windows-1254 or similar)
 * Note: Most thermal printers use specific code pages. 
 * For simplicity in V1, we'll focus on UTF-8 and basic character mapping if needed.
 */
export async function encodeText(text: string): Promise<Uint8Array> {
    const encoder = new TextEncoder();
    // We use CP1254 (Turkish) if the printer supports it, 
    // but for broad compatibility with cheap 58mm printers, 
    // we often need to map characters.
    // In V1, we'll use a simple encoder.
    return encoder.encode(text);
}

/**
 * Helper to combine multiple Uint8Arrays
 */
export function combineArrays(arrays: Uint8Array[]): Uint8Array {
    const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}
