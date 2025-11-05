import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import admin from 'firebase-admin';


@Injectable()
export class TeacherGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (error) {
      console.log('Error verifying token:', error);
      return false;
    }

    const user = decodedToken;
    request.user = user;

    if (!user || !user.uid) {
      return false;
    }

    // The rest of the logic can now use the user object
    const email = String(user.email).toLowerCase().trim();
    if (email === 'kjt081025@gmail.com') {
      user.type = 'teacher';
      return true;
    }

    const localPart = email.split('@')[0];
    const studentPattern = /^[sd]\d{4}$/i;

    if (studentPattern.test(localPart)) {
      user.type = 'student';
    } else {
      user.type = 'teacher';
    }

    return user.type === 'teacher';
  }
}
