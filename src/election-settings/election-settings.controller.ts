import { Controller, Post, Body, Get, Query, Patch, Param, NotFoundException, ConflictException, Delete } from '@nestjs/common';
import { ElectionSettingsService } from './election-settings.service';
import { CreateElectionSettingsDto } from './dto/create-election-settingdto';
import { UpdateElectionSettingsDto } from './dto/update-election-settingdto';

@Controller('settings')
export class ElectionSettingsController {
  constructor(private readonly service: ElectionSettingsService) {}

  @Post()
  async createOrSet(@Body() dto: CreateElectionSettingsDto) {
    const created = await this.service.setSettings(dto);
    if (!created) {
      throw new ConflictException('Election settings with this ID already exist.');
    }
    return { ok: true };
  }

  @Get()
  async get(@Query('electionId') electionId: string) {
    if (!electionId) return { ok: false, message: 'electionId required' };
    const settings = await this.service.getSettings(electionId);
    if (!settings) throw new NotFoundException('settings not found');
    return { ok: true, settings };
  }

  @Patch(':electionId')
  async update(@Param('electionId') electionId: string, @Body() dto: UpdateElectionSettingsDto) {
    const existing = await this.service.getSettings(electionId);
    if (!existing) throw new NotFoundException('settings not found');
    await this.service.updateSettings(electionId, dto);
    return { ok: true };
  }

  @Delete(':electionId')
  async delete(@Param('electionId') electionId: string) {
    const deleted = await this.service.deleteSettings(electionId);
    if (!deleted) {
      throw new NotFoundException('Election settings not found.');
    }
    return { ok: true };
  }
}