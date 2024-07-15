import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import { TaskColumnResponseDto } from "../types";

interface AddColumnButtonProps {
  boardId: number;
  setColumns: React.Dispatch<React.SetStateAction<TaskColumnResponseDto[]>>;
}

const AddColumnButton: React.FC<AddColumnButtonProps> = ({
  boardId,
  setColumns,
}) => {
  const [columnName, setColumnName] = useState("");

  const handleAddColumn = async () => {
    try {
      const response = await axiosInstance.post(`/boards/${boardId}/columns`, {
        columnName,
      });
      setColumns((prevColumns) => [...prevColumns, response.data.data]);
      setColumnName("");
    } catch (error) {
      console.error("Failed to add column:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={columnName}
        onChange={(e) => setColumnName(e.target.value)}
        placeholder="Add column"
      />
      <button onClick={handleAddColumn}>Add Column</button>
    </div>
  );
};

export default AddColumnButton;
