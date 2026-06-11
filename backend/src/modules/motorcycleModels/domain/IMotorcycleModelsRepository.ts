export interface CatalogIssue {
  id: string;
  title: string;
  description: string;
  severity: string;
  symptom?: string | null;
  inspectionTip?: string | null;
}

export interface CatalogModel {
  id: string;
  brand: string;
  name: string;
  category?: string | null;
  issues: CatalogIssue[];
}

export interface CreateModelData {
  brand: string;
  name: string;
  category?: string;
}

export interface CreateIssueData {
  title: string;
  description: string;
  severity?: string;
  symptom?: string;
  inspectionTip?: string;
}

export abstract class IMotorcycleModelsRepository {
  abstract findAll(): Promise<CatalogModel[]>;
  abstract findById(id: string): Promise<CatalogModel | null>;
  abstract create(data: CreateModelData): Promise<CatalogModel>;
  abstract addIssue(modelId: string, data: CreateIssueData): Promise<CatalogIssue>;
  abstract delete(id: string): Promise<void>;
  /** Busca modelos relevantes (RAG) por marca/modelo informados. */
  abstract findRelevant(brand?: string | null, model?: string | null): Promise<CatalogModel[]>;
}
