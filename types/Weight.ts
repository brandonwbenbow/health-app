import { KG } from "@/constants/Numbers";

export class Weight {
  static fromKG = (value: number) => {
    return new Weight(value);
  }

  static fromLB = (value: number) => {
    return new Weight(value * KG);
  }

  private _kilos: number = 0;
  public get kilos(): number { return this._kilos; }

  private _pounds: number = 0;
  public get pounds(): number { return this._pounds; }

  constructor(kilo: number) {
    this._kilos = kilo;
    this._pounds = kilo / KG;
  }

  public toString(kilo?: boolean, fixed?: number) {
    return kilo 
      ? `${Number(this._kilos.toFixed(fixed ?? 1))} kg`
      : `${Number(this._pounds.toFixed(fixed ?? 1))} lb${this._pounds > 1 ? 's' : ''}`
  }
}