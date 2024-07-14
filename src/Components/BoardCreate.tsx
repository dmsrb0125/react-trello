import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
`;

const BoardCreate = () => {
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/boards", {
        boardName,
        boardDescription,
      });
      console.log("Board created:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Failed to create board:", error);
    }
  };

  const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardName(e.target.value);
  };

  const handleBoardDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBoardDescription(e.target.value);
  };

  return (
    <Wrapper>
      <h2>Create Board</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Board Name"
          value={boardName}
          onChange={handleBoardNameChange}
          autoComplete="off"
        />
        <Input
          type="text"
          placeholder="Board Description"
          value={boardDescription}
          onChange={handleBoardDescriptionChange}
          autoComplete="off"
        />
        <Button type="submit">Create</Button>
      </Form>
    </Wrapper>
  );
};

export default BoardCreate;
