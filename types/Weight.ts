import { KG } from "@/constants/Numbers";

export class Weight {
  static fromKG = (value: number) => {
    return new Weight(value);
  }

  static fromLB = (value: number) => {
    return new Weight(value * KG);
  }

  private notSet: boolean;

  private _kilos: number = 0;
  public get kilos(): number { return this._kilos; }

  private _pounds: number = 0;
  public get pounds(): number { return this._pounds; }

  constructor(kilo: number | undefined) {
    this.notSet = kilo === undefined;
    this._kilos = kilo ?? 0;
    this._pounds = kilo ?? 0 / KG;
  }

  public toString(kilo?: boolean, fixed?: number) {
    if(isNaN(this._kilos)) { return 'No Weight Data' }
    if(this.notSet) { return kilo ? '-- kg' : '-- lb' }

    return kilo 
      ? `${Number(this._kilos.toFixed(fixed ?? 1))} kg`
      : `${Number(this._pounds.toFixed(fixed ?? 1))} lb${this._pounds > 1 ? 's' : ''}`
  }
}