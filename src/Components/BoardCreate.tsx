import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: skyblue;
`;

const Title = styled.h2`
  font-size: 40px;
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  width: 300px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
`;

const BoardCreate: React.FC = () => {
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardDescription(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/boards", {
        boardName,
        boardDescription,
      });
      console.log("Board created:", response.data);
    } catch (error) {
      console.error("Failed to create board:", error);
    }
  };

  return (
    <Wrapper>
      <Title>Create a new Board</Title>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Board Name"
          value={boardName}
          onChange={handleNameChange}
        />
        <Input
          type="text"
          placeholder="Board Description"
          value={boardDescription}
          onChange={handleDescriptionChange}
        />
        <Button type="submit">Create Board</Button>
      </form>
    </Wrapper>
  );
};

export default BoardCreate;
