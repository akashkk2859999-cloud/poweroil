import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import prisma from '../../db';
import { config } from '../../config';
import { ApiError } from '../../utils/apiError';

export async function loginAdmin(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin || !admin.isActive) {
    throw new ApiError('INVALID_CREDENTIALS', 'Invalid email or password.', 401);
  }

  const valid = await argon2.verify(admin.passwordHash, password);
  if (!valid) {
    throw new ApiError('INVALID_CREDENTIALS', 'Invalid email or password.', 401);
  }

  await prisma.adminUser.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });

  const token = jwt.sign(
    { adminId: admin.id, email: admin.email, role: admin.role },
    config.jwtSecret,
    { expiresIn: '12h' }
  );

  return {
    token,
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
  };
}
