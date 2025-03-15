import { SubmissionRepository } from '../repositories/submission.repository';

export class SubmissionService {
  static async submit(data: any) {
    return SubmissionRepository.create(data);
  }
}

// import { SubmissionRepository } from "../repositories/submission.repository";
// import { ISubmission } from "../models/submission.model";

// export class SubmissionService {
//   static async submitForm(formId: string, data: Record<string, any>): Promise<ISubmission> {
//     return SubmissionRepository.createSubmission({ formId, data });
//   }

//   static async getSubmissionsByForm(formId: string): Promise<ISubmission[]> {
//     return SubmissionRepository.findByFormId(formId);
//   }
// }
