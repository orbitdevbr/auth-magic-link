"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios, { AxiosError } from "axios";
import { LoaderPinwheel } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";

export function LoginForm() {
  // Router serve para fazer redirect de páginas
  const router = useRouter();

  const searchParams = useSearchParams();

  const [loadingToken, setLoadingToken] = useState(false);
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      setLoadingToken(true);
      setTokenError("");
      axios
        .post("/api/auth", {
          token,
        })
        .then((response) => {
          router.push("/");
        })
        .catch((error) => {
          setTokenError("Esse token não é válido ou expirou.");
        })
        .finally(() => {
          setLoadingToken(false);
        });
    }
  }, [router, searchParams]);

  // Referência para os inputs
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Estados do formulário
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Função que realiza o login ao enviar o formulário
  const handleLoginSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      // Previne o envio do formulário pelo navegador
      event.preventDefault();
      // Reseta os estados do formulário
      setFormError("");
      setFormLoading(true);

      // Verifica se os inputs existem na página
      if (emailInputRef.current) {
        // Pega os valores preenchidos nos inputs
        const emailInput = emailInputRef.current.value;

        try {
          const schema = z.object({
            email: z.string().email(),
          });

          const { email } = schema.parse({ email: emailInput });

          // tenta realizar o login
          const response = await axios.post("/api/login", {
            email,
          });

          if (response.status === 200) {
            setFormSuccess(true);
          } else {
            setFormSuccess(false);
            setFormError("Não foi possível realizar o login");
          }

          setFormLoading(false);
        } catch (error) {
          // Altera o estado de forma genérica, sem informar o erro
          setFormError("login invalid");
          setFormLoading(false);
          setFormSuccess(false);
        }
      }
    },
    []
  );

  return (
    <form onSubmit={(event) => handleLoginSubmit(event)}>
      <Card className="w-full max-w-sm m-auto mt-5">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              ref={emailInputRef}
              id="email"
              type="email"
              placeholder="seu@email.com.br"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="grid">
          {/* Erro genérico por segurança */}
          {formError && (
            <div className="text-amber-600 mb-4">
              <p className="text-sm font-semibold">Erro no login</p>
              <p>Verifique suas credenciais.</p>
            </div>
          )}
          {tokenError && (
            <div className="text-amber-600 mb-4">
              <p className="text-sm font-semibold">Erro no login</p>
              <p>{tokenError}</p>
            </div>
          )}
          {formSuccess && (
            <div className="text-green-600 mb-4">
              <p className="text-sm font-semibold">Verifique seu e-mail</p>
              <p>Um link de login foi enviado para seu e-mail.</p>
            </div>
          )}
          <Button
            className="w-full flex items-center gap-2"
            disabled={formLoading || loadingToken}
          >
            {(formLoading || loadingToken) && (
              <LoaderPinwheel className="w-[18px] animate-spin" />
            )}
            Entrar
          </Button>
          <div className="mt-5 underline text-center">
            <Link href="/cadastro">Ir para o cadastro</Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
