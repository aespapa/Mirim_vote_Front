import { IsString, IsBoolean, IsNumber, IsOptional, IsISO8601 } from 'class-validator';

export class CreateElectionSettingsDto {
  @IsString()
  electionId: string;

  @IsBoolean()
  active: boolean;

  @IsNumber()
  voterCount: number;

  @IsBoolean()
  autoClose: boolean;
}