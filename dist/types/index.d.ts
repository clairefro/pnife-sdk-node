export declare class Pnife {
    private opts;
    constructor(opts?: PnifeOptions);
    sayHello(): number;
}
export interface PnifeOptions {
  openAiApiKey?: string;
}