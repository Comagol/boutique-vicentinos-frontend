import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Heading,
  FormControl,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ChangeEvent } from "react";
import { useAuthStrore } from "../../../stores/authStore";
import { createToaster } from "@chakra-ui/react";
import type { ApiError } from "../../../types";

const toast = createToaster({ placement: "top-end" });

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { login } = useAuthStrore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }
}