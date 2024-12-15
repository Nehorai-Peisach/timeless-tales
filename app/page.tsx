'use client'
import { useState } from "react";
import s from './style.module.scss';

export default function UploadPage() {
  const [formData, setFormData] = useState({
    email: "",
    content: "",
    image: null,
  });
  const [message, setMessage] = useState("");
  const [filePath, setFilePath] = useState("");

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = new FormData();
    data.append("user", formData.email);
    data.append("content", formData.content);
    data.append("image", formData.image || '');

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage("Form submitted successfully!");
        setFilePath(result.path || "");
        setFormData({ email: "", content: "", image: null });
      } else {
        setMessage("Failed to submit form.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className={s.wrapper}>
      <div className={s.contentWrapper}>

        <h1>Upload Form</h1>
        <form className={s.form} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              className={s.input}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="content">Content:</label>
            <textarea
              className={s.input}
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Submit</button>
        </form>
        {message && <p>{message}</p>}
        {filePath && (
          <button
            onClick={() => window.open(filePath, "_blank")}
            style={{ marginTop: "10px" }}
          >
            Open Uploaded File
          </button>
        )}
      </div>
    </div>
  );
}
