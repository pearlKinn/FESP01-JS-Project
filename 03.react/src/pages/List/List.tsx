import instance from "@/api/instance";
import { Header } from "@/layout/Header/Header";
import styles from "@/pages/List/List.module.css";
import {
  faMagnifyingGlass,
  faPenToSquare,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const List = () => {
  const [data, setData] = useState<{ items: TodoItem[] | undefined }>();
  const [filterState, setFilterState] = useState(false);
  const [notCompletedItem, setNotCompletedItem] = useState<{
    items?: TodoItem[];
  }>();
  const [searchTerm, setSearchTerm] = useState<string>("");

  async function fetchData() {
    try {
      const response = await instance.get<TodoListResponse>("/");
      setData(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckTodo = async function (id: number) {
    const isItemChecked = data?.items?.find((item) => item._id === id);

    if (isItemChecked) {
      const updatedItem = { ...isItemChecked, done: !isItemChecked.done };
      try {
        await instance.patch(`/${id}`, updatedItem);

        if (filterState) {
          setNotCompletedItem((prevData) => {
            if (!prevData) return prevData;
            const updatedItems = prevData?.map((item) =>
              item._id === updatedItem._id ? updatedItem : item
            );
            return updatedItems;
          });
        } else {
          setData((prevData) => {
            if (!prevData) return prevData;
            const updatedItems = prevData.items?.map((item) =>
              item._id === id ? updatedItem : item
            );
            return { ...prevData, items: updatedItems };
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleTodoDelete = async function (id: number) {
    try {
      await instance.delete<TodoResponse>(`/${id}`);
      setData((prevData) => {
        const updatedItems = prevData?.items?.filter((item) => item._id !== id);
        return { ...prevData, items: updatedItems };
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleTodoFilter = function (e: { preventDefault: () => void }) {
    e.preventDefault();
    if (filterState) {
      fetchData();
    } else {
      const filteredItems: TodoItem[] | undefined = data?.items?.filter(
        (item: TodoItem) => !item.done
      );
      setNotCompletedItem(filteredItems);
    }
    setFilterState(!filterState);
  };

  const filteredItems: TodoItem[] | undefined = data?.items?.filter(
    (todoItem) => todoItem.title.includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Header>TODO App</Header>
      <div id={styles.content}>
        <div className={styles.optionBtnWrapper}>
          {filterState ? (
            ""
          ) : (
            <div className={styles.searchBar}>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className={styles.fontAwesomeIcon}
              />
              <form action="">
                <input
                  type="text"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="할일 검색"
                  className={styles.searchInput}
                />
              </form>
            </div>
          )}
          <Link to="/regist" className={styles.registBtn}>
            <FontAwesomeIcon className={styles.fontAwesomeIcon} icon={faPlus} />
          </Link>
        </div>

        <ul className={styles.todoList}>
          {filterState
            ? notCompletedItem?.map((item: TodoItem, i: number) => (
                <li key={`${item._id}-${i}`} className={styles.todoListItem}>
                  <div className={styles.itemWrapper}>
                    <input
                      type="checkbox"
                      onChange={() => handleCheckTodo(item._id)}
                      checked={item.done}
                    />
                    <Link
                      to={`/info/${item._id}`}
                      className={
                        item.done ? styles.doneItemLink : styles.undoItemLink
                      }
                    >
                      {item.title}
                    </Link>
                  </div>
                  <div className={styles.todoActionWrapper}>
                    <Link to={`/update/${item._id}`}>
                      <FontAwesomeIcon
                        className={styles.fontAwesomeIcon}
                        icon={faPenToSquare}
                      />
                    </Link>
                    <button
                      title="삭제"
                      className={styles.deleteBtn}
                      onClick={() => handleTodoDelete(item._id)}
                    >
                      <FontAwesomeIcon
                        className={styles.fontAwesomeIcon}
                        icon={faTrashCan}
                      />
                    </button>
                  </div>
                </li>
              ))
            : filteredItems?.map((item, i) => (
                <li key={`${item._id}-${i}`} className={styles.todoListItem}>
                  <div className={styles.itemWrapper}>
                    <input
                      type="checkbox"
                      onChange={() => handleCheckTodo(item._id)}
                      checked={item.done}
                    />
                    <Link
                      to={`/info/${item._id}`}
                      className={
                        item.done ? styles.doneItemLink : styles.undoItemLink
                      }
                    >
                      {item.title}
                    </Link>
                  </div>
                  <div className={styles.todoActionWrapper}>
                    <Link to={`/update/${item._id}`}>
                      <FontAwesomeIcon
                        className={styles.fontAwesomeIcon}
                        icon={faPenToSquare}
                      />
                    </Link>
                    <button
                      title="삭제"
                      className={styles.deleteBtn}
                      onClick={() => handleTodoDelete(item._id)}
                    >
                      <FontAwesomeIcon
                        className={styles.fontAwesomeIcon}
                        icon={faTrashCan}
                      />
                    </button>
                  </div>
                </li>
              ))}
        </ul>
        <button className={styles.filterBtn} onClick={handleTodoFilter}>
          {filterState ? "전체보기" : "미완료 항목 보기"}
        </button>
      </div>
    </div>
  );
};
