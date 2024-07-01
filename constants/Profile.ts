
export type ProfileData = {
  height?: number,
  targetWeight?: number
}

export class Profile {
  private data: ProfileData;

  constructor(data: ProfileData | undefined) {
    this.data = data ?? {};
  }

  isValid() { return this.data.height != null && this.data.targetWeight != null }

  getData() { return this.data; }
}