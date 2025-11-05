// class-president.service.ts
import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { ClassPresidentCandidate } from './interfaces/class.interface';
import * as admin from 'firebase-admin';

@Injectable()
export class ClassPresidentService {
  constructor(private readonly firebase: FirebaseService) {}

  // 후보 추가
  async addPresident(data: Omit<ClassPresidentCandidate, 'id' | 'count'>) {
    
    await this.firebase.db.collection('class-president-candidates').add({ ...data, count: 0 });
    return true;
  }

  // 후보 조회
  async getPresidents(year:number, semester:number, grade:number, classNum:number) {
    const ref = this.firebase.db.collection('class-president-candidates');
    let query = ref.where('year', '==', year).where('semester', '==', semester)
      .where('grade','==',grade).where('classNum','==',classNum);
    const snapshot = await query.get();
    return { list : snapshot.docs.map(doc => ({ number: doc.id, ...doc.data() }))}; 
  }

  //모든 후보 조회
  async getAllPresidents() {
    const ref = this.firebase.db.collection('class-president-candidates');
    const snapshot = await ref.get();
    const list: admin.firestore.DocumentData[] = [];

    snapshot.forEach((doc) => {
      list.push( doc.data() );
    });
    return { list };
  }

  // 개표결과 조회
  async getResults(year:number, semester:number, grade:number, classNum:number) {
    return this.getPresidents(year, semester, grade, classNum); // count 포함 응답 (구조 동일)
  }

  // 후보 수정
  async updatePresident(number:string, update: Partial<Omit<ClassPresidentCandidate, 'id'>>) {
    await this.firebase.db.collection('class-president-candidates').doc(number).update(update);
    return true;
  }

   // 후보에 투표하면 count를 1 증가
   async voteCandidate(id: string): Promise<void> {
    await this.firebase.db
      .collection('class-president-candidates')
      .doc(id)
      .update({ count: admin.firestore.FieldValue.increment(1) });
  }
  // 후보 삭제
  async deletePresident(number:string) {
    await this.firebase.db.collection('class-president-candidates').doc(number).delete();
    return true;
  }
}
