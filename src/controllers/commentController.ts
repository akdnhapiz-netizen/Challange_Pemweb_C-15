import { Request, Response } from 'express';
import prisma from '../prisma';

export const createComment = async (req: Request, res: Response) => {
  try {
    const { content, postId, authorId } = req.body;

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ message: 'content is required and cannot be empty' });
    }

    if (postId === undefined || postId === null || isNaN(Number(postId))) {
      return res.status(400).json({ message: 'valid postId is required' });
    }

    if (authorId === undefined || authorId === null || isNaN(Number(authorId))) {
      return res.status(400).json({ message: 'valid authorId is required' });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId: Number(postId),
        authorId: Number(authorId),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return res.status(201).json(comment);
  } catch (error: any) {
    if (error.code === 'P2003') {
      return res.status(404).json({
        message: 'Foreign key constraint failed: Post or User not found',
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return res.status(200).json(comments);
  } catch (error: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const getCommentById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    return res.status(200).json(comment);
  } catch (error: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const { content } = req.body;
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ message: 'content is required and cannot be empty' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        content: content.trim(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return res.status(200).json(updatedComment);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Comment not found' });
    }

    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await prisma.comment.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Comment not found' });
    }

    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
