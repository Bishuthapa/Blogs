"use client";

import { useState } from "react";
import axios from "axios";

export default function Blog() {
  const [data, setData] = useState({
    title: "",
    tags: "",
    content: "",
    published: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await axios.post("/api/blogs", {
        title: data.title.trim(),
        tags: data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
        content: data.content,
        published: data.published,
      }, {
        withCredentials: true
      });

      console.log(res.data);
      setSuccess(true);

      // clear form after submit
      setData({
        title: "",
        tags: "",
        content: "",
        published: false,
      });
    } catch (err) {
      if (err instanceof Error)
        console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h1>Create Blog</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Blog Created Successfully!</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={data.title}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={data.tags}
          onChange={handleChange}
        />
        <br />

        <textarea
          name="content"
          placeholder="Content"
          value={data.content}
          onChange={handleChange}
          required
        />
        <br />
        
        <button
          type="button"
          onClick={() => setData((prev) => ({
            ...prev,
            published: !prev.published
          }))}
        >
          {data.published ? "Unpublish" : "Publish"}
        </button>
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
