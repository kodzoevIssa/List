import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./PostList.css";

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

const POSTS_PER_PAGE = 10;

export const PostList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      if (!res.ok) {
        throw new Error("Ошибка при загрузке постов");
      }
      return res.json();
    },
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!res.ok) {
        throw new Error("Ошибка при загрузке пользователей");
      }
      return res.json();
    },
  });

  if (isLoading) return <p>Загрузка...</p>;
  if (error instanceof Error) return <p>{error.message}</p>;

  const getUserName = (userId: number) =>
    users?.find((user) => user.id === userId)?.name || "Неизвестен";

  const totalPosts = posts?.length || 0;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const currentPage = new URLSearchParams(location.search).get("page");
  const page = currentPage ? parseInt(currentPage) : 1;

  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts?.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    navigate(`?page=${pageNumber}`);
  };

  return (
    <div className="list">
      <h1 className="list__h1">Список постов</h1>
      <ul className="list__ul">
        {currentPosts?.map((post) => (
          <li className="list__li" key={post.id}>
            <h2 className="list__h2">
              {post.id}. {post.title}
            </h2>
            <p className="list__author">Автор: {getUserName(post.userId)}</p>
            <p className="list__body">{post.body}</p>
            <Link
              className="list__link"
              to={`/post/${post.id}`}
              state={{ author: getUserName(post.userId) }}
            >
              Просмотр
            </Link>
          </li>
        ))}
      </ul>

      <div className="pagination">
        {page > 1 && (
          <button
            onClick={() => handlePageChange(page - 1)}
            className="pagination__button"
          >
            Предыдущая
          </button>
        )}
        <span className="pagination__span">
          Страница {page} из {totalPages}
        </span>
        {page < totalPages && (
          <button
            onClick={() => handlePageChange(page + 1)}
            className="pagination__button"
          >
            Следующая
          </button>
        )}
      </div>
    </div>
  );
};
