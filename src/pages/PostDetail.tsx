import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./PostDetail.css";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type User = {
  id: number;
  name: string;
};

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { author?: string };

  const postId = Number(id);

  const {
    data: post,
    isLoading: loadingPost,
    error: postError,
  } = useQuery<Post>({
    queryKey: ["post", postId],
    queryFn: async () => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`
      );
      if (!res.ok) {
        throw new Error("Ошибка при загрузке поста");
      }
      return res.json();
    },
    enabled: !!postId,
  });

  const userId = post?.userId;

  const {
    data: user,
    isLoading: loadingUser,
    error: userError,
  } = useQuery<User>({
    queryKey: userId ? ["user", userId] : [],
    queryFn: async () => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      );
      if (!res.ok) {
        throw new Error("Ошибка при загрузке пользователя");
      }
      return res.json();
    },
    enabled: !!userId,
  });

  if (loadingPost || loadingUser) return <p className="loading">Загрузка...</p>;
  if (postError || userError) return <p>Ошибка при загрузке данных</p>;
  if (!post) return <p>Пост не найден</p>;

  return (
    <div className="Detail">
      <h1 className="Detail__h1">{post.title}</h1>
      <p className="Detail__p">{post.body}</p>
      <p className="Detail__author">
        Автор: {state?.author || user?.name || "Неизвестен"}
      </p>
      <button className="Detail__btn" onClick={() => navigate(-1)}>
        Назад
      </button>
    </div>
  );
};
