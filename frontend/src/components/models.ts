export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Article {
  article_id: number;
  author_user_id: number;
  title: string;
  content: string;
  created_at: string;
  release_date: string | null;
}

