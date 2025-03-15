import { Form, IForm } from '../models/form.model';

export class FormRepository {
  static async create(formData: Partial<IForm>): Promise<IForm> {
    return Form.create(formData);
  }
}