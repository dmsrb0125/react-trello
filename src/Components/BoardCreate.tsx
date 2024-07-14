import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";

const BoardCreate: React.FC = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/boards", { name });
      navigate("/");
    } catch (error) {
      console.error("Failed to create board:", error);
    }
  };

  return (
    <div>
      <h1>Create Board</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Board Name"
          required
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default BoardCreate;
