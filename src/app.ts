import express from 'express';
import cors from 'cors';
import commentRoutes from './routes/comment.routes';
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON payload' });
  }
  return res.status(500).json({ message: 'Internal server error' });
});

export default app;
