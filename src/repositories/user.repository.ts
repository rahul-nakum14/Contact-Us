import { User, IUser } from '../models/user.model';

export class UserRepository {
  static async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  static async create(userData: Partial<IUser>): Promise<IUser> {
    return User.create(userData);
  }
}