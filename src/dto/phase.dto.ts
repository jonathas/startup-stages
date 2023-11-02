import { IsInt, IsString } from 'class-validator';

export class PhaseDTO {
  @IsInt()
  public order: number;

  @IsString()
  public title: string;
}

export class CreatePhaseInput extends PhaseDTO {}

export class UpdatePhaseInput extends PhaseDTO {
  @IsString()
  public id: string;
}
