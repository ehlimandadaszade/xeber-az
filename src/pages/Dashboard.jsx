import { useEffect, useState } from "react";

export default function Dashboard() {
  const [news, setNews] = useState([]);

  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    image: "",
    category: "",
  });

  async function loadNews() {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:3000/api/admin/news",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    setNews(data);
  }

  useEffect(() => {
    loadNews();
  }, []);

  async function addNews(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await fetch(
      "http://localhost:3000/api/admin/news",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(form),
      }
    );

    setForm({
      title: "",
      summary: "",
      content: "",
      image: "",
      category: "",
    });

    loadNews();
  }

  async function deleteNews(id) {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:3000/api/admin/news/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    loadNews();
  }

  return (
    <div className="container">

      <h1>Admin panel</h1>

      <form onSubmit={addNews}>

        <input
          placeholder="Başlıq"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
        />

        <input
          placeholder="Xülasə"
          value={form.summary}
          onChange={(e) =>
            setForm({
              ...form,
              summary: e.target.value,
            })
          }
        />

        <input
          placeholder="Şəkil URL"
          value={form.image}
          onChange={(e) =>
            setForm({
              ...form,
              image: e.target.value,
            })
          }
        />

        <input
          placeholder="Kateqoriya"
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Xəbərin mətni"
          value={form.content}
          onChange={(e) =>
            setForm({
              ...form,
              content: e.target.value,
            })
          }
        />

        <button>
          Xəbər əlavə et
        </button>

      </form>


      <hr />

      <h2>Xəbərlər</h2>

      {news.map((item) => (
        <div key={item.id}>

          <h3>{item.title}</h3>

          <button
            onClick={() =>
              deleteNews(item.id)
            }
          >
            Sil
          </button>

        </div>
      ))}

    </div>
  );
}