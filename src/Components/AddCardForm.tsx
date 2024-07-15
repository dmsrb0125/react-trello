import React, { useState } from "react";
import styled from "styled-components";
import axiosInstance from "../axiosConfig";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 3px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 5px;
  background-color: #5aac44;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    background-color: #61bd4f;
  }
`;

interface AddCardFormProps {
  boardId: number;
  columnId: number;
}

const AddCardForm: React.FC<AddCardFormProps> = ({ boardId, columnId }) => {
  const [cardText, setCardText] = useState("");

  const handleAddCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cardText.trim()) {
      try {
        await axiosInstance.post(
          `/boards/${boardId}/columns/${columnId}/cards`,
          {
            text: cardText,
          }
        );
        setCardText("");
      } catch (error) {
        console.error("Failed to add card:", error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardText(e.target.value);
  };

  return (
    <Form onSubmit={handleAddCard}>
      <Input
        type="text"
        value={cardText}
        onChange={handleInputChange}
        placeholder="Add new card"
      />
      <Button type="submit">Add Card</Button>
    </Form>
  );
};

export default AddCardForm;
