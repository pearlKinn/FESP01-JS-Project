import { Header } from "../../layout/Header/Header";
import Button from "@/components/Button/Button";
import styles from "./Regist.module.css";
import { Input } from "@/components/Input/Input";
import { useState } from "react";
import instance from "@/api/instance";
import { Link } from "react-router-dom";

export const Regist = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  const handleSubmit = () => {
    instance
      .post("", {
        title: title,
        content: content,
        done: false,
      })
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className={`${styles.registPage}`}>
      <Link to="/" className={styles.backBtn}>
        &lt;
      </Link>
      <Header>TODO App 등록</Header>
      <div className={styles.registContainer}>
        <Input label="제목:" value={title} onChange={handleTitleChange} />
        <Input label="내용:" value={content} onChange={handleContentChange} />
        <Button option="regist" label="등록" onClick={handleSubmit} />
      </div>
    </div>
  );
};
