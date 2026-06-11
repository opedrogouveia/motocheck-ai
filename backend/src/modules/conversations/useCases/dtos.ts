import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateConversationDTO {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;
}

export class RenameConversationDTO {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;
}

export class SendMessageDTO {
  @IsString()
  @MinLength(1, { message: 'A mensagem não pode ser vazia.' })
  @MaxLength(8000, { message: 'Mensagem muito longa (máx. 8000 caracteres).' })
  content!: string;
}

export class AnswerQuestionDTO {
  // Resposta do vendedor (quando o usuário tem a informação).
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  answer?: string;

  // Marcar como "não sei" (o usuário não tem essa informação).
  @IsOptional()
  @IsBoolean()
  skip?: boolean;
}
