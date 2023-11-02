import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreatePhaseInput {
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  public order: number;

  @IsString()
  @IsNotEmpty()
  public title: string;
}

export class UpdatePhaseInput {
  @IsString()
  public id: string;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @IsOptional()
  public order: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public title: string;
}
