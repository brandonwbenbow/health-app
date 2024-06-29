
export type UserData = {
  name?: string,
  height?: number,
  weight?: number
}

export class User {
  private data: UserData;

  constructor(data: UserData | undefined) {
    this.data = data ?? {};
  }

  getData() { return this.data; }
}