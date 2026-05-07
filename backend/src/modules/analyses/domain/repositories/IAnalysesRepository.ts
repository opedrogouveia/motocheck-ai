import { Analysis } from '../entities/Analysis';

export abstract class IAnalysesRepository {
  abstract findAll(): Promise<Analysis[]>;
  abstract findById(id: string): Promise<Analysis | null>;
  abstract create(analysis: Analysis): Promise<Analysis>;
  abstract update(id: string, data: Partial<Analysis>): Promise<Analysis>;
  abstract delete(id: string): Promise<void>;
}
