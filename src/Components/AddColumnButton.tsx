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
      console.log("Response data:", response.data); // 서버 응답 데이터 확인
      const newColumn = response.data.data; // response.data.data에서 새로운 컬럼 객체 가져오기

      if (newColumn && newColumn.id !== undefined) {
        setColumns((prevColumns) => [...prevColumns, newColumn]);
      } else {
        console.error("New column data is missing id property");
      }

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
