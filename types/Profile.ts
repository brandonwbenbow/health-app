export type ProfileData = {
  male?: boolean,
  height?: number,
  birthday?: number,
  goal?: {
    weight?: number,
    calories?: number
  }
}

export class Profile {
  static isValid(data?: ProfileData) {
    return data?.male !== undefined
      && data?.height !== undefined
      && data?.birthday !== undefined
  }

  private data: ProfileData;

  constructor(data?: ProfileData) {
    this.data = data ?? {};
  }

  isValid() { return Profile.isValid(this.data); }

  getData() { return this.data; }
}