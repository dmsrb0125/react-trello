import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import { useToDoContext } from "../ToDoContext";
import styled from "styled-components";
import { ITodo } from "../types";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  width: 80%;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
`;

interface AddCardFormProps {
  boardId: number;
  columnId: number;
}

const AddCardForm: React.FC<AddCardFormProps> = ({ boardId, columnId }) => {
  const [text, setText] = useState("");
  const { toDos, setToDos } = useToDoContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/columns/${columnId}/cards`, {
        cardName: text,
      });
      const newCard: ITodo = response.data.data;

      setToDos((prevToDos) => ({
        ...prevToDos,
        [columnId]: [...prevToDos[columnId], newCard],
      }));
      setText("");
    } catch (error) {
      console.error("Failed to add card:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={text}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setText(e.target.value)
        }
        placeholder="Add a new card"
      />
      <Button type="submit">Add Card</Button>
    </Form>
  );
};

export default AddCardForm;
