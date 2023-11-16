import instance from "@/api/instance";
import { Header } from "@/layout/Header/Header";
import styles from "@/pages/List/List.module.css";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
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
          console.log(notCompletedItem);
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

  const handleTodoDelete = function (id: number) {
    const deleteItem = async function () {
      try {
        await instance.delete<TodoResponse>(`/${id}`);
        setData((prevData) => {
          const updatedItems = prevData?.items?.filter(
            (item) => item._id !== id
          );
          return { ...prevData, items: updatedItems };
        });
      } catch (error) {
        console.error(error);
      }
    };
    deleteItem();
  };

  const handleFilter = function (e: { preventDefault: () => void }) {
    e.preventDefault();
    const filteredItems: TodoItem[] | undefined = data?.items?.filter(
      (item: TodoItem) => !item.done
    );
    setFilterState(!filterState);
    if (!filterState) {
      setNotCompletedItem(filteredItems);
    } else {
      fetchData();
    }
  };

  const handleSearchedItem = function () {
    if (!searchTerm) {
      setFilterState(false);
      setNotCompletedItem(undefined);
    } else {
      const filteredItems: TodoItem[] | undefined = data?.items?.filter(
        (item: TodoItem) =>
          item.title.includes(searchTerm) || item.content.includes(searchTerm)
      );
      console.log(filteredItems);
      setFilterState(true);
      // setData(filteredItems);
    }
  };

  if (data) {
    return (
      <div>
        <Header>TODO App</Header>
        <div id={styles.content}>
          <div className={styles.optionBtnWrapper}>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className={styles.searchBtn}
              onClick={handleSearchedItem}
            />
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                console.log(searchTerm);
              }}
            />
            <Link to="/regist" className={styles.registBtn}>
              <FontAwesomeIcon style={{ color: "black" }} icon={faPlus} />
            </Link>
          </div>

          <ul className={styles.todoList}>
            {filterState
              ? notCompletedItem?.map((item: TodoItem, i: number) => {
                  return (
                    <li
                      key={`${item._id}-${i}`}
                      className={styles.todoListItem}
                    >
                      <div className={styles.itemWrapper}>
                        <input
                          type="checkbox"
                          onChange={() => handleCheckTodo(item._id)}
                          checked={item.done}
                        />
                        <Link
                          to={`/info/${item._id}`}
                          className={
                            item.done
                              ? styles.doneItemLink
                              : styles.undoItemLink
                          }
                        >
                          {item.title}
                        </Link>
                      </div>
                      <div className={styles.todoActionWrapper}>
                        <Link to={`/update/${item._id}`}>
                          <FontAwesomeIcon
                            style={{ color: "black" }}
                            icon={faPenToSquare}
                          />
                        </Link>
                        <button
                          title="삭제"
                          className={styles.deleteBtn}
                          onClick={() => handleTodoDelete(item._id)}
                        >
                          <FontAwesomeIcon
                            style={{ color: "black" }}
                            icon={faTrashCan}
                          />
                        </button>
                      </div>
                    </li>
                  );
                })
              : data?.items?.map((item, i) => {
                  return (
                    <li
                      key={`${item._id}-${i}`}
                      className={styles.todoListItem}
                    >
                      <div className={styles.itemWrapper}>
                        <input
                          type="checkbox"
                          onChange={() => handleCheckTodo(item._id)}
                          checked={item.done}
                        />
                        <Link
                          to={`/info/${item._id}`}
                          className={
                            item.done
                              ? styles.doneItemLink
                              : styles.undoItemLink
                          }
                        >
                          {item.title}
                        </Link>
                      </div>
                      <div className={styles.todoActionWrapper}>
                        <Link to={`/update/${item._id}`}>
                          <FontAwesomeIcon
                            style={{ color: "black" }}
                            icon={faPenToSquare}
                          />
                        </Link>
                        <button
                          title="삭제"
                          className={styles.deleteBtn}
                          onClick={() => handleTodoDelete(item._id)}
                        >
                          <FontAwesomeIcon
                            style={{ color: "black" }}
                            icon={faTrashCan}
                          />
                        </button>
                      </div>
                    </li>
                  );
                })}
          </ul>
          <button className={styles.filterBtn} onClick={handleFilter}>
            {filterState ? "전체보기" : "미완료 항목 보기"}
          </button>
        </div>
      </div>
    );
  }
};
