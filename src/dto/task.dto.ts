import { IsBoolean, IsString } from 'class-validator';

export class TaskDTO {
  @IsString()
  public title: string = '';

  @IsBoolean()
  public isDone: boolean = false;

  @IsString()
  public phaseId: string = '';
}
