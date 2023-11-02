import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskInput {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsBoolean()
  public isDone: boolean;

  @IsString()
  @IsNotEmpty()
  public phaseId: string;
}

export class UpdateTaskInput {
  @IsString()
  public id: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public title: string;

  @IsBoolean()
  @IsOptional()
  public isDone: boolean;
}
