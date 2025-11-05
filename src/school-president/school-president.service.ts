// school-president.service.ts
import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { SchoolPresidentCandidate } from './interfaces/school.interface';
import * as admin from 'firebase-admin';
@Injectable()
export class SchoolPresidentService {
  constructor(private readonly firebase: FirebaseService) { }

  // 후보 추가
  async addPresident(data: Omit<SchoolPresidentCandidate, 'id' | 'count'>) {
    await this.firebase.db.collection('school-president-candidates').add({ ...data, count: 0 });
    return true;
  }

  // 후보 조회
  async getPresidents(year: number) {
    const snapshot = await this.firebase.db.collection('school-president-candidates')
      .where('year', '==', year).get();
    return { list: snapshot.docs.map(doc => ({ number: doc.id, ...doc.data() })) };
  }

  //모든 후보 조회
  async getAllPresidents() {
    const ref = this.firebase.db.collection('school-president-candidates');
    const snapshot = await ref.get();
    const list: admin.firestore.DocumentData[] = [];

    snapshot.forEach((doc) => {
      list.push(doc.data());
    });
    return { list };
  }

  // 개표 결과 조회(득표수 포함)
  async getResults(year: number) {
    const snapshot = await this.firebase.db.collection('school-president-candidates')
      .where('year', '==', year).get();
    return { list: snapshot.docs.map(doc => ({ number: doc.id, ...doc.data() })) };
  }

  // 후보 수정
  async updatePresident(number: string, update: Partial<Omit<SchoolPresidentCandidate, 'id'>>) {
    await this.firebase.db.collection('school-president-candidates').doc(number).update(update);
    return true;
  }

  // 후보에 투표하면 count를 1 증가
  async voteCandidate(id: string): Promise<void> {
    await this.firebase.db
      .collection('school-president-candidates')
      .doc(id)
      .update({ count: admin.firestore.FieldValue.increment(1) });
  }
  // 후보 삭제
  async deletePresident(number: string) {
    await this.firebase.db.collection('school-president-candidates').doc(number).delete();
    return true;
  }
}
