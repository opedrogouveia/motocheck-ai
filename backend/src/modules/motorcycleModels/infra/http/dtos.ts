import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export class CreateMotorcycleModelDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  brand!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(80)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  category?: string;
}

export class CreateKnownIssueDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title!: string;

  @IsString()
  @MinLength(5)
  description!: string;

  @IsOptional()
  @IsIn(SEVERITIES, { message: 'severity deve ser LOW, MEDIUM, HIGH ou CRITICAL.' })
  severity?: string;

  @IsOptional()
  @IsString()
  symptom?: string;

  @IsOptional()
  @IsString()
  inspectionTip?: string;
}
