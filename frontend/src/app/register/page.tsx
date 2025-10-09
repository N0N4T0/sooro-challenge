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
import { RegisterRequest } from '@/types'

const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { register: registerUser, isRegisterLoading, registerError } = useAuth()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data
    registerUser(registerData as RegisterRequest)
  }

  return (
    <Container maxW="md" py={12}>
      <Card.Root>
        <Card.Header>
          <Flex direction="column" align="center" gap={2}>
            <Heading size="lg">Cadastrar</Heading>
            <Text color="gray.600">Crie sua conta</Text>
          </Flex>
        </Card.Header>
        
        <Card.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={4}>
              {registerError && (
                <Box p={3} bg="red.50" borderRadius="md" border="1px" borderColor="red.200">
                  <Text color="red.600">
                    {registerError.message || 'Erro ao criar conta'}
                  </Text>
                </Box>
              )}
              
              <Box>
                <Text mb={2} fontWeight="medium">Nome</Text>
                <Input
                  type="text"
                  placeholder="Seu nome completo"
                  {...register('nome')}
                />
                {errors.nome && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.nome.message}
                  </Text>
                )}
              </Box>

              <Box>
                <Text mb={2} fontWeight="medium">Email</Text>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                />
                {errors.email && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.email.message}
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

              <Box>
                <Text mb={2} fontWeight="medium">Confirmar Senha</Text>
                <Input
                  type="password"
                  placeholder="Confirme sua senha"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </Box>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                loading={isRegisterLoading}
                loadingText="Criando conta..."
              >
                Cadastrar
              </Button>
            </Stack>
          </form>
        </Card.Body>
        
        <Card.Footer>
          <Text textAlign="center" w="full">
            Já tem uma conta?{' '}
            <ChakraLink asChild color="blue.500">
              <Link href="/login">Entrar</Link>
            </ChakraLink>
          </Text>
        </Card.Footer>
      </Card.Root>
    </Container>
  )
}
