import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateElectionSettingsDto } from './dto/create-election-settingdto';
import { UpdateElectionSettingsDto } from './dto/update-election-settingdto';
import { ElectionSettings } from './interfaces/ElectionSettings';

@Injectable()
export class ElectionSettingsService {
  constructor(private readonly firebase: FirebaseService) {}

  private collection() {
    return this.firebase.db.collection('election-settings');
  }

    async setSettings(dto: CreateElectionSettingsDto): Promise<boolean> {
    const docRef = this.collection().doc(dto.electionId);
    const doc = await docRef.get();

    if (doc.exists) {
      return false; // Already exists
    }

    await docRef.set({
      electionId: dto.electionId,
      active: dto.active,
      voterCount: dto.voterCount,
      autoClose: dto.autoClose,
    }, { merge: true });

    return true; // Successfully created
  }

  async getSettings(electionId: string): Promise<ElectionSettings | null> {
    const snap = await this.collection().doc(electionId).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...(snap.data() as ElectionSettings) };
  }

  async updateSettings(electionId: string, update: UpdateElectionSettingsDto): Promise<void> {
    await this.collection().doc(electionId).update({
      ...update,
    });
  }

  async deleteSettings(electionId: string): Promise<boolean> {
    const docRef = this.collection().doc(electionId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return false; // Not found
    }

    await docRef.delete();
    return true; // Successfully deleted
  }
}