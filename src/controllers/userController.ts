import { Request, Response } from 'express';
import prisma from '../prisma';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });

    return res.status(201).json(user);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
        comments: true,
      },
    });
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: true,
        comments: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ message: 'User not found' });
    }

    await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
