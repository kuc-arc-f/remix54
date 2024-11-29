import { D1Database } from '@cloudflare/workers-types';

export async function getTodos(db: D1Database, searchQuery?: string) {
  if (searchQuery) {
    return await db.prepare(
      "SELECT * FROM todo7 WHERE title LIKE ? OR content LIKE ? ORDER BY created_at DESC"
    )
      .bind(`%${searchQuery}%`, `%${searchQuery}%`)
      .all();
  }
  return await db.prepare("SELECT * FROM todo7 ORDER BY created_at DESC").all();
}

export async function getTodo(db: D1Database, id: string) {
  return await db.prepare("SELECT * FROM todo7 WHERE id = ?")
    .bind(id)
    .first();
}

export async function createTodo(db: D1Database, todo: Todo) {
  return await db.prepare(`
    INSERT INTO todo7 (
      title, content, public, 
      foodOrange, foodApple, foodBanana, 
      pubDate, qty1, qty2, qty3
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    todo.title,
    todo.content,
    todo.public,
    todo.foodOrange ? 1 : 0,
    todo.foodApple ? 1 : 0,
    todo.foodBanana ? 1 : 0,
    todo.pubDate,
    todo.qty1,
    todo.qty2,
    todo.qty3
  ).run();
}

export async function updateTodo(db: D1Database, id: string, todo: Todo) {
  return await db.prepare(`
    UPDATE todo7 
    SET title = ?, 
        content = ?, 
        public = ?, 
        foodOrange = ?, 
        foodApple = ?, 
        foodBanana = ?, 
        pubDate = ?, 
        qty1 = ?, 
        qty2 = ?, 
        qty3 = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    todo.title,
    todo.content,
    todo.public,
    todo.foodOrange ? 1 : 0,
    todo.foodApple ? 1 : 0,
    todo.foodBanana ? 1 : 0,
    todo.pubDate,
    todo.qty1,
    todo.qty2,
    todo.qty3,
    id
  ).run();
}

export async function deleteTodo(db: D1Database, id: string) {
  return await db.prepare("DELETE FROM todo7 WHERE id = ?")
    .bind(id)
    .run();
}