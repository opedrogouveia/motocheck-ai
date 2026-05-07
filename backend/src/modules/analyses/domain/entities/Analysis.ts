export class Analysis {
  id?: string;
  adText!: string;
  riskLevel!: string;
  suspiciousTerms!: string[];
  questionsToAsk!: string[];
  userId!: string;
  createdAt?: Date;

  private constructor(props: Analysis) {
    Object.assign(this, props);
  }

  static create(props: Analysis): Analysis {
    return new Analysis(props);
  }
}
