import getCrudifulAxios from './axios_config';
import { AxiosResponse } from 'axios';
import { Article } from 'src/components/models';

export interface LoginResponse {
  authorization: string;
}

const useMock = true;

export async function loginPost(username: string, password: string): Promise<LoginResponse> {
  const path = 'login';

  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (username === 'user' && password === 'password') {
          resolve({ authorization: 'mocked-jwt-token' });
        } else {
          throw new Error('Invalid credentials');
        }
      }, 1000);
    });
  } else {
    const response = await getCrudifulAxios().post<{
      username: string,
      password: string
    }, AxiosResponse<LoginResponse>>(path, { username, password });

    return response.data;
  }
}

export async function fetchArticles(): Promise<Article[]> {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            article_id: 1,
            author_user_id: 1,
            title: 'First article',
            content: 'Content 1',
            created_at: new Date().toISOString(),
            release_date: null,
          },
          {
            article_id: 2,
            author_user_id: 1,
            title: 'Second article',
            content: 'Content 2',
            created_at: new Date().toISOString(),
            release_date: null,
          }
        ]);
      }, 1000);
    });
  } else {
    const path = 'articles';
    const response = await getCrudifulAxios().get<Article[]>(path);
    return response.data;
  }
}

export async function createArticle(newArticle: Article): Promise<Article> {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const createdArticle = { ...newArticle, article_id: Math.floor(Math.random() * 1000) };
        resolve(createdArticle);
      }, 1000);
    });
  } else {
    const path = 'articles';
    const response = await getCrudifulAxios().post<Article>(path, newArticle);
    return response.data;
  }
}

export async function updateArticle(articleId: number, updatedArticle: Partial<Article>): Promise<Article> {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedData = { article_id: articleId, ...updatedArticle };
        resolve(updatedData as Article);
      }, 1000);
    });
  } else {
    const path = `articles/${articleId}`;
    const response = await getCrudifulAxios().put<Article>(path, updatedArticle);
    return response.data;
  }
}

export async function deleteArticle(articleId: number): Promise<void> {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  } else {
    const path = `articles/${articleId}`;
    await getCrudifulAxios().delete(path);
  }
}

export async function loginEmailTokenPost(token: string): Promise<LoginResponse> {
  const path = 'login/email_token';

  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ authorization: 'mocked_token_456' });
      }, 1000);
    });
  } else {
    const response = await getCrudifulAxios().post<null, AxiosResponse<LoginResponse>>(path, null, {
      params: { token: token }
    });
    return response.data;
  }
}
