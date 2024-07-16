import { CM } from "@/constants/Numbers";
import { Weight } from "./Weight";

export type ProfileData = {
  male: boolean,
  height: number,
  birthday: number,
  goalWeight: number,
  useKG?: boolean
}

export class Profile {
  static isValid(data?: ProfileData | any) {
    return data?.male !== undefined
      && data?.height !== undefined
      && data?.birthday !== undefined
      && data?.goalWeight !== undefined
  }

  private data: ProfileData;

  constructor(data?: ProfileData | any) {
    this.data = {
      male: data?.male ?? true,
      height: data?.height ?? 0,
      birthday: data?.birthday ?? Date.now(),
      goalWeight: data?.goalWeight ?? 0,
      useKG: data?.useKG ?? false
    };
  }

  isValid() { return Profile.isValid(this.data); }

  getData() { return this.data; }

  calculateBMR(weight?: Weight) {
    if(weight == undefined || isNaN(weight.kilos)) { return 'No Weight Data' }
    let bmr = 10 * weight.kilos + 6.25 * (this.data.height) - 5 * this.getAge();
    bmr += this.data.male ? 5 : -161;
    return bmr.toFixed(2);;
  }

  calculateBMI(weight?: Weight) {
    if(weight == undefined || isNaN(weight.kilos)) { return 'No Weight Data' }
    let meters = this.data.height / 100;
    let heightSquared = meters * meters;
    return (weight.kilos / heightSquared).toFixed(2);
  }

  getBMIColor(bmi: number, bad = '#FA2A2A', warning = '#FFA500', good = '#00ED83') {
    if(isNaN(bmi)) { return '#ffffff' }
    else if(bmi < 18.5) { return bad; }
    else if(bmi < 25) { return good; }
    else if(bmi < 30) { return warning; }
    else { return bad; }
  }

  getAge() {
    return (new Date()).getFullYear() - (new Date(this.data.birthday ?? Date.now())).getFullYear();
  }

  getHeightString(fixed?: number, cm = this.data.useKG) {
    return cm 
    ? `${Number(this.data.height.toFixed(fixed ?? 1))} cm`
    : `${Number((this.data.height / CM).toFixed(fixed ?? 1))} in`
  }

  getGoalWeightString(fixed?: number, kilo = this.data.useKG) {
    return (new Weight(this.data.goalWeight)).toString(kilo, fixed);
  }
}