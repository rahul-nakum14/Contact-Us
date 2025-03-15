import { UserRepository } from '../repositories/user.repository';

export class UserService {
  static async getUserById(id: string) {
    return UserRepository.findById(id);
  }
}
