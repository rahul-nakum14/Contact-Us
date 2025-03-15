import { Submission, ISubmission } from '../models/submission.model';

export class SubmissionRepository {
  static async create(submissionData: Partial<ISubmission>): Promise<ISubmission> {
    return Submission.create(submissionData);
  }
}
