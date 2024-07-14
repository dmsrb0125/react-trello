import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import DragabbleCard from "./DragabbleCard";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
import axiosInstance from "../axiosConfig";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

interface IForm {
  toDo: string;
}

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
`;

const Area = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["isDraggingOver", "isDraggingFromThis"].includes(prop),
})<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Wrapper = styled.div`
  padding: 20px 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

const AddColumnButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  background-color: #2d3436;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #636e72;
  }
`;

const Board = ({ toDos, boardId }: IBoardProps) => {
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const setToDos = useSetRecoilState(toDoState);
  const [columns, setColumns] = useState<string[]>(["To Do", "Doing", "Done"]);

  const { boardId: paramBoardId } = useParams<{ boardId: string }>();

  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      const newState = {
        ...allBoards,
        [paramBoardId || boardId]: [
          newToDo,
          ...allBoards[paramBoardId || boardId],
        ],
      };
      axiosInstance.post("http://localhost:8080/api/update", newState);
      return newState;
    });
    setValue("toDo", "");
  };

  const addColumn = async () => {
    const newColumn = `New Column ${columns.length + 1}`;
    if (paramBoardId || boardId) {
      try {
        await axiosInstance.post(
          `/boards/${encodeURIComponent(paramBoardId || boardId)}/columns`,
          { columnName: newColumn }
        );
        setColumns([...columns, newColumn]);
      } catch (error) {
        console.error("Failed to add column:", error);
      }
    } else {
      console.error("Board ID is undefined");
    }
  };

  useEffect(() => {
    if (paramBoardId) {
      fetchBoard(paramBoardId);
    }
  }, [paramBoardId]);

  const fetchBoard = async (boardId: string) => {
    try {
      const response = await axiosInstance.get(
        `/boards/${encodeURIComponent(boardId)}`
      );
      console.log("Board data fetched:", response.data);
    } catch (error) {
      console.error("Failed to fetch board:", error);
    }
  };

  return (
    <Wrapper>
      <Title>{paramBoardId || boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("toDo", { required: true })}
          type="text"
          placeholder={`Add task on ${paramBoardId || boardId}`}
        />
      </Form>
      <Droppable droppableId={paramBoardId || boardId || ""}>
        {(magic, info) => (
          <Area
            isDraggingOver={info.isDraggingOver}
            isDraggingFromThis={Boolean(info.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DragabbleCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
      {columns.map((column, index) => (
        <div key={index}>{column}</div>
      ))}
      <AddColumnButton onClick={addColumn}>+ Add Column</AddColumnButton>
    </Wrapper>
  );
};

export default Board;
