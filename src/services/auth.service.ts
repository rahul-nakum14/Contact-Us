import { UserRepository } from '../repositories/user.repository';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export class AuthService {
    static async generateToken(userId: string) {
      return jwt.sign({ id: userId }, ENV.JWT_SECRET, { expiresIn: '7d' });
    }
  
    static async googleAuth(googleId: string, email: string, name: string) {
      let user = await UserRepository.findByEmail(email);
      if (!user) {
        user = await UserRepository.create({ googleId, email, name });
      }
      return this.generateToken(user.id);
    }
  
    static async facebookAuth(facebookId: string, email: string, name: string) {
      let user = await UserRepository.findByEmail(email);
      if (!user) {
        user = await UserRepository.create({ facebookId, email, name });
      }
      return this.generateToken(user.id);
    }
  }
  