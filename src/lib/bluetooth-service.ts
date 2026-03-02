import { ESCPOS, combineArrays } from "./escpos";

/**
 * Modern Bluetooth ESC/POS Service
 * Handles connection, command preparation, and chunked transmission
 */
export class BluetoothService {
    private device: BluetoothDevice | null = null;
    private characteristic: BluetoothRemoteGATTCharacteristic | null = null;

    // Generic thermal printer service/char IDs
    private static SERVICE_UUID = '000018f0-0000-1000-8000-00805f9b34fb';
    private static CHARACTERISTIC_UUID = '00002af1-0000-1000-8000-00805f9b34fb';

    /**
     * Request printer device and connect
     */
    async connect(): Promise<boolean> {
        try {
            this.device = await navigator.bluetooth.requestDevice({
                filters: [{
                    services: [BluetoothService.SERVICE_UUID],
                }],
                optionalServices: [BluetoothService.SERVICE_UUID]
            });

            const server = await this.device.gatt?.connect();
            const service = await server?.getPrimaryService(BluetoothService.SERVICE_UUID);
            this.characteristic = (await service?.getCharacteristic(BluetoothService.CHARACTERISTIC_UUID)) || null;

            return !!this.characteristic;
        } catch (error) {
            console.error("Bluetooth connection error:", error);
            return false;
        }
    }

    /**
     * Send data to printer in chunks (to fit MTU limits)
     */
    async print(data: Uint8Array): Promise<void> {
        if (!this.characteristic) {
            throw new Error("Printer not connected");
        }

        // Typical Bluetooth MTU is small, 20 bytes is a safe chunk size
        const CHUNK_SIZE = 20;
        for (let i = 0; i < data.length; i += CHUNK_SIZE) {
            const chunk = data.slice(i, i + CHUNK_SIZE);
            await this.characteristic.writeValue(chunk);
        }
    }

    /**
     * Disconnect device
     */
    async disconnect() {
        if (this.device?.gatt?.connected) {
            this.device.gatt.disconnect();
        }
        this.device = null;
        this.characteristic = null;
    }

    /**
     * Static helper to prepare a receipt print job
     */
    static prepareReceiptJob(content: {
        title: string;
        details: Array<{ label: string; value: string }>;
        totalTitle?: string;
        totalValue?: string;
        footer?: string;
    }): Uint8Array {
        const encoder = new TextEncoder();
        const commands: Uint8Array[] = [ESCPOS.INIT];

        // Title (Business Name)
        commands.push(ESCPOS.ALIGN.CENTER);
        commands.push(ESCPOS.TEXT_FORMAT.BOLD_ON);
        commands.push(ESCPOS.TEXT_FORMAT.LARGE);
        commands.push(encoder.encode(content.title + '\n'));
        commands.push(ESCPOS.TEXT_FORMAT.NORMAL);
        commands.push(ESCPOS.TEXT_FORMAT.BOLD_OFF);
        commands.push(encoder.encode('--------------------------------\n'));

        // Details
        commands.push(ESCPOS.ALIGN.LEFT);
        content.details.forEach(item => {
            commands.push(encoder.encode(`${item.label}: ${item.value}\n`));
        });
        commands.push(encoder.encode('--------------------------------\n'));

        // Total
        if (content.totalTitle) {
            commands.push(ESCPOS.ALIGN.RIGHT);
            commands.push(ESCPOS.TEXT_FORMAT.BOLD_ON);
            commands.push(encoder.encode(`${content.totalTitle}: ${content.totalValue}\n`));
            commands.push(ESCPOS.TEXT_FORMAT.BOLD_OFF);
        }

        // Footer
        if (content.footer) {
            commands.push(ESCPOS.ALIGN.CENTER);
            commands.push(encoder.encode('\n' + content.footer + '\n'));
        }

        // Paper Feed and Cut
        commands.push(encoder.encode('\n\n\n'));
        commands.push(ESCPOS.PAPER.PART_CUT);

        return combineArrays(commands);
    }
}

// Global instance to maintain connection across components
export const bluetoothPrinter = new BluetoothService();
