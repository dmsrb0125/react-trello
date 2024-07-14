import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import styled from "styled-components";
import { useAuth } from "../AuthContext";

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

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // 토큰이 있을 경우, 메인 페이지로 리디렉션
      login();
      navigate("/");
    }
  }, [isAuthenticated, navigate, login]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/users/login", { username, password });
      console.log("Login response:", response); // 응답 데이터 확인

      // 응답 헤더에서 토큰 추출
      const token = response.headers["authorization"];
      if (token) {
        localStorage.setItem("token", token); // Bearer 접두사 포함하여 저장
        login(); // 인증 상태 업데이트
        console.log(
          "Token stored in localStorage:",
          localStorage.getItem("token")
        );
        navigate("/"); // 메인 페이지로 리디렉션
      } else {
        setError("No token found in the response");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please check your username and password."); // 에러 메시지 설정
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={handleLogin}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <Button type="submit">Login</Button>
      </Form>
      {error && <ErrorMessage>{error}</ErrorMessage>} {/* 에러 메시지 표시 */}
    </Wrapper>
  );
};

export default Login;
