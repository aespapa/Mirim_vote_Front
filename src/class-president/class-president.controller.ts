// ...existing code...
import { Controller, Get, Post, Patch, Delete, Query, Body, UseGuards, Param } from '@nestjs/common';
import { ClassPresidentService } from './class-president.service';
import { CreateClassPresidentDto } from './dto/create-class.dto';
import { UpdateClassPresidentDto } from './dto/update-class.dto';
import { TeacherGuard } from '../Teacher';
@Controller('apivoteclass-president')
export class ClassPresidentController {
  constructor(private readonly service: ClassPresidentService) { }

  @Post() // 후보 추가 (선생님 전용)
  @UseGuards(TeacherGuard)
  async create(@Body() dto: CreateClassPresidentDto) {
    return { success: await this.service.addPresident(dto) };
  }

  @Get() // 후보 리스트 조회 (모두 접근 가능)
  async list(
    @Query('year') year: number,
    @Query('semester') semester: number,
    @Query('grade') grade: number,
    @Query('class') classNum: number,
  ) {
    const list = await this.service.getPresidents(Number(year), Number(semester), Number(grade), Number(classNum));
    // console.log(list);
    return list;
  }

  @Get('all')
  async all() {
    return await this.service.getAllPresidents();
  }

  @Post(':id/vote') // 투표: 학생도 호출 가능
  async vote(@Param('id') id: string) {
    await this.service.voteCandidate(id);
    return { success: true };
  }

  @Patch() // 후보 수정 (선생님 전용)
  @UseGuards(TeacherGuard)
  async update(@Query('id') id: string, @Body() dto: UpdateClassPresidentDto) {
    await this.service.updatePresident(id, dto);
    return { success: true };
  }

  @Delete() // 후보 삭제 (선생님 전용)
  @UseGuards(TeacherGuard)
  async remove(@Query('number') num: string) {
    await this.service.deletePresident(num);
    return { success: true };
  }
}