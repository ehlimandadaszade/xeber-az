import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function News() {
  const { id } = useParams();
  const [news, setNews] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/news/${id}`)
      .then((res) => res.json())
      .then((data) => setNews(data));
  }, [id]);

  if (!news) {
    return <p>Yüklənir...</p>;
  }

  return (
    <article className="container">
      {news.image && (
        <img
          className="news-image"
          src={news.image}
          alt={news.title}
        />
      )}

      <small>{news.category}</small>

      <h1>{news.title}</h1>

      <h3>{news.summary}</h3>

      <p>{news.content}</p>
    </article>
  );
}