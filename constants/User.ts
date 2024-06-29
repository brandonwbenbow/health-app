
export type UserData = {
  name?: string,
  height?: number,
  targetWeight?: number
}

export class User {
  private data: UserData;

  constructor(data: UserData | undefined) {
    this.data = data ?? {};
  }

  isValid() { return this.data.name != null }

  getData() { return this.data; }
}