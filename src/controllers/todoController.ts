import { Request, Response } from 'express';
import pool from '../database';

export const getTodos = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id ');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

export const createTodo = async (req: Request, res: Response) => {
  const { title, describe } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO todos (title, describe, completed) VALUES ($1, $2, $3) RETURNING *',
      [title, describe, false]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

export const updateTodo = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, describe, completed } = req.body;
  try {
    const result = await pool.query(
      'UPDATE todos SET title = $1, describe = $2, completed = $3 WHERE id = $4 RETURNING *',
      [title, describe, completed, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

export const deleteTodo = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};
