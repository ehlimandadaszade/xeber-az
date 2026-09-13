import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/news")
      .then((res) => res.json())
      .then((data) => setNews(data));
  }, []);

  return (
    <div className="container">
      <h1>Son xəbərlər</h1>

      <div className="news-grid">
        {news.map((item) => (
          <article className="card" key={item.id}>
            {item.image && (
              <img src={item.image} alt={item.title} />
            )}

            <small>{item.category}</small>

            <h2>{item.title}</h2>

            <p>{item.summary}</p>

            <Link to={`/news/${item.id}`}>
              Ətraflı oxu →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}