export class User {
  id?: string;
  name!: string;
  email!: string;
  password!: string;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: User) {
    Object.assign(this, props);
  }

  static create(props: User): User {
    return new User(props);
  }
}
