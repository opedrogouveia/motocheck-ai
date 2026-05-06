import { User } from '../entities/User';

export abstract class IUsersRepository {
  abstract create(user: User): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
}
