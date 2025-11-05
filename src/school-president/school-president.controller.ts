import { Controller, Post, Get, Patch, Delete, Body, Query, Param, UseGuards } from '@nestjs/common';
import { SchoolPresidentService } from './school-president.service';
import { CreateSchoolPresidentDto } from './dto/create-school.dto';
import { UpdateSchoolPresidentDto } from './dto/update-school.dto';
import { TeacherGuard } from '../Teacher';

@Controller('apivoteschool-president')
export class SchoolPresidentController {
  constructor(private readonly schoolPresidentService: SchoolPresidentService) { }

  @Post() // 후보 추가 (선생님 전용)
  @UseGuards(TeacherGuard)
  async create(@Body() createDto: CreateSchoolPresidentDto) {
    await this.schoolPresidentService.addPresident(createDto);
    return { success: true };
  }

  @Get() // 후보 리스트 조회 (모두 접근 가능)
  async list(@Query('year') year: number) {
    return await this.schoolPresidentService.getPresidents(Number(year));
  }

  @Get('all')
  async all() {
    return await this.schoolPresidentService.getAllPresidents();
  }

  @Get('result') // 개표 결과 조회 (count 포함, 모두 접근 가능)
  async result(@Query('year') year: number) {
    return await this.schoolPresidentService.getResults(Number(year));
  }

  @Post(':id/vote') // 투표: 학생도 호출 가능
  async vote(@Param('id') id: string) {
    await this.schoolPresidentService.voteCandidate(id);
    return { success: true };
  }

  @Patch() // 후보 수정 (선생님 전용)
  @UseGuards(TeacherGuard)
  async update(
    @Query('number') number: string,
    @Body() updateDto: UpdateSchoolPresidentDto,
  ) {
    await this.schoolPresidentService.updatePresident(number, updateDto);
    return { success: true };
  }

  @Delete() // 후보 삭제 (선생님 전용)
  @UseGuards(TeacherGuard)
  async remove(@Query('number') number: string) {
    await this.schoolPresidentService.deletePresident(number);
    return { success: true };
  }
}