import { IsInt, IsString } from 'class-validator';

export class PhaseDTO {
  @IsInt()
  public order: number = 0;

  @IsString()
  public title: string = '';
}
