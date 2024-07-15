import React, { useState } from "react";
import styled from "styled-components";
import axiosInstance from "../axiosConfig";

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
`;

const AddColumnContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

interface AddColumnButtonProps {
  boardId: string;
}

const AddColumnButton: React.FC<AddColumnButtonProps> = ({ boardId }) => {
  const [columnName, setColumnName] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColumnName(event.target.value);
  };

  const handleAddColumn = async () => {
    if (columnName.trim() === "") return;

    try {
      await axiosInstance.post(`/boards/${boardId}/columns`, {
        columnName,
      });

      // 컬럼 추가 후 컬럼 목록을 다시 가져오거나 상태를 업데이트하는 로직을 추가합니다.
      setColumnName("");
      // TODO: Add logic to refresh column list or update state
    } catch (error) {
      console.error("Failed to add column:", error);
    }
  };

  return (
    <AddColumnContainer>
      <Input
        type="text"
        value={columnName}
        onChange={handleInputChange}
        placeholder="Enter column name"
      />
      <Button onClick={handleAddColumn}>Add Column</Button>
    </AddColumnContainer>
  );
};

export default AddColumnButton;
