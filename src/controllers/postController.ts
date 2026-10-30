import { Request, Response } from 'express';
import prisma from '../prisma';
import { validatePosts } from '../utils/validate';

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, published, authorId } = req.body;

    if (!title || authorId === undefined || authorId === null) {
      return res.status(400).json({ message: 'Title and authorId are required' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: Boolean(published),
        authorId: Number(authorId),
      },
      include: {
        author: true,
        comments: true,
      },
    });

    return res.status(201).json(post);
  } catch (error: any) {
    if (error.code === 'P2003') {
      return res.status(404).json({ message: 'Author not found' });
    }
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return res.status(200).json(posts);
  } catch (error: any) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json(post);
  } catch (error: any) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const { title, content, published } = req.body;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(published !== undefined && { published: Boolean(published) }),
      },
    });

    return res.status(200).json(updatedPost);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await prisma.post.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const bulkCreatePosts = async (req: Request, res: Response) => {
  try {
    const posts = req.body;

    const errors = validatePosts(posts);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validasi gagal', errors });
    }

    const result = await prisma.post.createMany({
      data: posts.map((post: any) => ({
        title: post.title,
        content: post.content,
        published: Boolean(post.published),
        authorId: Number(post.authorId),
      })),
    });

    return res.status(201).json({
      message: `${result.count} post berhasil dibuat`,
      count: result.count,
    });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return res.status(404).json({ message: 'Ada authorId yang tidak terdaftar' });
    }
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};