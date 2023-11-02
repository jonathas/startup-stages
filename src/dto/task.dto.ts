import { IsBoolean, IsString } from 'class-validator';

export class TaskDTO {
  @IsString()
  public title: string;

  @IsBoolean()
  public isDone: boolean;

  @IsString()
  public phaseId: string;
}

export class CreateTaskInput extends TaskDTO {}

export class UpdateTaskInput extends TaskDTO {
  @IsString()
  public id: string;
}
