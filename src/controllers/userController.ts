import { Request, Response } from 'express';
import prisma from '../prisma';
import { validateUser } from '../utils/validate';

export const createUser = async (req: Request, res: Response) => {
  try {
    const errors = validateUser(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validasi gagal', errors });
    }

    const { email, name, password } = req.body;

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
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

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

    const { published } = req.query;
    if (published !== undefined && published !== 'true' && published !== 'false') {
      return res.status(400).json({ message: "published must be 'true' or 'false'" });
    }

    const where = {
      authorId: id,
      ...(published !== undefined && { published: published === 'true' }),
    };

    const [posts, total] = await prisma.$transaction([
      prisma.post.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count({ where }),
    ]);

    return res.status(200).json({
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};