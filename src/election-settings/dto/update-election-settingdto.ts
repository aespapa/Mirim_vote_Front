import { IsString, IsBoolean, IsNumber, IsOptional, IsISO8601 } from 'class-validator';

export class UpdateElectionSettingsDto {
  @IsOptional() 
  @IsString()
  electionId?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsNumber()
  voterCount?: number;

  @IsOptional()
  @IsBoolean()
  autoClose?: boolean;
}