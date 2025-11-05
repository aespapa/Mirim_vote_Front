import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { ServeStaticModule } from '@nestjs/serve-static'; //npm install @nestjs/serve-static 설치 필요
import { join } from 'path'
import { SchoolPresidentModule } from './school-president/school-president.module';
import { SchoolPresidentController } from './school-president/school-president.controller';
import { SchoolPresidentService } from './school-president/school-president.service';
import { ClassPresidentModule } from './class-president/class-president.module';
import { ClassPresidentService } from './class-president/class-president.service';
import { ClassPresidentController } from './class-president/class-president.controller';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseModule } from './firebase/firebase.module';
import { ElectionSettingsModule } from './election-settings/election-settings.module';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'MirimVote', 'dist'),
      exclude: ['/apivote*'],
    }),
    AuthModule,
    ClassPresidentModule,
    SchoolPresidentModule,
    FirebaseModule,
    ElectionSettingsModule,
  ],
  controllers: [AuthController, SchoolPresidentController, ClassPresidentController],
  providers: [AuthService, ClassPresidentService, SchoolPresidentService, FirebaseService],
})
export class AppModule {}