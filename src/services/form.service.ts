import { FormRepository } from '../repositories/form.repository';

export class FormService {
  static async createForm(data: any) {
    return FormRepository.create(data);
  }
}