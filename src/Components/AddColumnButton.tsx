import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axiosInstance from "../axiosConfig";
import { TaskColumnResponseDto } from "../types";

interface AddColumnButtonProps {
  boardId: number;
  setColumns: React.Dispatch<React.SetStateAction<TaskColumnResponseDto[]>>;
}

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  margin-right: 10px;
`;

const AddColumnButton: React.FC<AddColumnButtonProps> = ({
  boardId,
  setColumns,
}) => {
  const [columnName, setColumnName] = useState("");
  const navigate = useNavigate();

  const handleAddColumn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/boards/${boardId}/columns`, {
        columnName,
      });
      setColumns((prevColumns) => [...prevColumns, response.data.data]);
      setColumnName("");
      navigate(`/board/${boardId}`);
    } catch (error) {
      console.error("Failed to add column:", error);
    }
  };

  return (
    <div>
      <Input
        type="text"
        value={columnName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setColumnName(e.target.value)
        } // 타입 지정
        placeholder="Add column"
      />
      <Button onClick={handleAddColumn}>Add Column</Button>
    </div>
  );
};

export default AddColumnButton;
