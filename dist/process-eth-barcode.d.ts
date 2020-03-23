import { HttpService, EventHandler, Message, Plugin } from 'universal-ledger-agent';
export declare class ProcessEthBarcode implements Plugin {
    private _httpService;
    private _eventHandler?;
    constructor(_httpService: HttpService);
    /**
     * The name of the plugin
     * @return {string}
     */
    readonly name: string;
    /**
     * Receive the eventHandler so we can put messages
     * back on the ULA again
     * @param {EventHandler} eventHandler
     */
    initialize(eventHandler: EventHandler): void;
    /**
     * Handle incoming messages
     * @param {Message} message
     * @param callback
     * @return {Promise<string>}
     */
    handleEvent(message: Message, callback: any): Promise<string>;
}
export default ProcessEthBarcode;
