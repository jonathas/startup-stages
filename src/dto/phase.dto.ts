import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class PhaseDTO {
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  public order: number;

  @IsString()
  @IsNotEmpty()
  public title: string;
}

export class CreatePhaseInput extends PhaseDTO {}

export class UpdatePhaseInput extends PhaseDTO {
  @IsString()
  public id: string;
}
