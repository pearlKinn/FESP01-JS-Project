import instance from "@/api/instance";
import Button from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Header } from "@/layout/Header/Header";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./Update.module.css";

export const Update = () => {
  const { todoId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function fetchData() {
    try {
      const response = await instance.get<TodoResponse>(`/${todoId}`);
      const respondData = response.data;
      setTitle(respondData.item.title);
      setContent(respondData.item.content);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };
  const handleSubmit = () => {
    instance
      .patch(`/${todoId}`, {
        title: title,
        content: content,
      })
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className={`${styles.updatePage}`}>
      <Link to="/" className={styles.backBtn}>
        &lt;
      </Link>
      <Header>TODO App 수정</Header>
      <div className={styles.updateContainer}>
        <Input label="제목:" value={title} onChange={handleTitleChange} />
        <Input label="내용:" value={content} onChange={handleContentChange} />
        <Button option="regist" label="수정" onClick={handleSubmit} />
      </div>
    </div>
  );
};
