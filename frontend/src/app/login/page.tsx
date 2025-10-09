'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  Alert,
  Link as ChakraLink
} from '@chakra-ui/react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { LoginRequest } from '@/types'

const loginSchema = z.object({
  userName: z.string().min(1, 'Nome de usuário deve ter pelo menos 1 caractere'),
  password: z.string().min(1, 'Senha deve ter pelo menos 1 caracter'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login, isLoginLoading, loginError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    login(data as LoginRequest)
  }

  return (
    <Container maxW="md" py={12}>
      <Card.Root>
        <Card.Header>
          <Flex direction="column" align="center" gap={2}>
            <Heading size="lg">Entrar</Heading>
            <Text color="gray.600">Entre na sua conta</Text>
          </Flex>
        </Card.Header>

        <Card.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={4}>
              {loginError && (
                <Box p={3} bg="red.50" borderRadius="md" border="1px" borderColor="red.200">
                  <Text color="red.600">
                    {'Erro ao fazer login'}
                  </Text>
                </Box>
              )}

              <Box>
                <Text mb={2} fontWeight="medium">Nome de usuário</Text>
                <Input
                  type="text"
                  placeholder="Seu nome de usuário"
                  {...register('userName')}
                />
                {errors.userName && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.userName.message}
                  </Text>
                )}
              </Box>

              <Box>
                <Text mb={2} fontWeight="medium">Senha</Text>
                <Input
                  type="password"
                  placeholder="Sua senha"
                  {...register('password')}
                />
                {errors.password && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.password.message}
                  </Text>
                )}
              </Box>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                loading={isLoginLoading}
                loadingText="Entrando..."
              >
                Entrar
              </Button>
            </Stack>
          </form>
        </Card.Body>

        <Card.Footer>
          <Text textAlign="center" w="full">
            Não tem uma conta?{' '}
            <ChakraLink asChild color="blue.500">
              <Link href="/register">Cadastre-se</Link>
            </ChakraLink>
          </Text>
        </Card.Footer>
      </Card.Root>
    </Container>
  )
}
