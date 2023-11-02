import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class TaskDTO {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsBoolean()
  public isDone: boolean;

  @IsString()
  @IsNotEmpty()
  public phaseId: string;
}

export class CreateTaskInput extends TaskDTO {}

export class UpdateTaskInput extends TaskDTO {
  @IsString()
  public id: string;
}
