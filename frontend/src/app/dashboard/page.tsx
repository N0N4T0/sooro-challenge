'use client'

import { useState } from 'react'
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
  Badge,
  Grid,
  Spinner,
  HStack,
  VStack
} from '@chakra-ui/react'
import { useAuth } from '@/hooks/use-auth'
import { useExamIMC } from '@/hooks/use-exam-imc'
import { Exam } from '@/types'

function ExamCard({ exam }: { exam: Exam }) {
  const getClassificationColor = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'abaixo do peso':
        return 'blue'
      case 'peso normal':
        return 'green'
      case 'sobrepeso':
        return 'yellow'
      case 'obesidade grau i':
        return 'orange'
      case 'obesidade grau ii':
        return 'red'
      case 'obesidade grau iii':
        return 'red'
      default:
        return 'gray'
    }
  }

  return (
    <Card.Root>
      <Card.Body>
        <VStack align="start" gap={3}>
          <HStack justify="space-between" w="full">
            <Text fontWeight="bold">IMC: {exam.imc.toFixed(2)}</Text>
            <Badge colorScheme={getClassificationColor(exam.classificacao)}>
              {exam.classificacao}
            </Badge>
          </HStack>

          <Grid templateColumns="1fr 1fr" gap={4} w="full">
            <Box>
              <Text fontSize="sm" color="gray.600">Peso</Text>
              <Text fontWeight="medium">{exam.peso} kg</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600">Altura</Text>
              <Text fontWeight="medium">{exam.altura} m</Text>
            </Box>
          </Grid>

          <Text fontSize="sm" color="gray.500">
            {new Date(exam.dt_inclusao).toLocaleDateString('pt-BR')}
          </Text>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}

export default function DashboardPage() {
  const { user, logout, isLoading: isLoadingUser } = useAuth()
  const { useExamsByUser, useSearchExams } = useExamIMC()
  const [searchQuery, setSearchQuery] = useState('')

  const { data: userExams, isLoading: isLoadingUserExams } = useExamsByUser()
  const { data: searchResults, isLoading: isSearching } = useSearchExams(searchQuery)

  const examsToShow = searchQuery ? searchResults : userExams

  if (isLoadingUser) {
    return (
      <Container maxW="md" py={12}>
        <Flex justify="center" align="center" minH="50vh">
          <Spinner size="xl" />
        </Flex>
      </Container>
    )
  }

  if (!user) {
    return (
      <Container maxW="md" py={12}>
        <Box p={3} bg="red.50" borderRadius="md" border="1px" borderColor="red.200">
          <Text color="red.600">
            Usuário não encontrado. Faça login novamente.
          </Text>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxW="6xl" py={8}>
      <Stack gap={8}>
        <Flex justify="space-between" align="center">
          <VStack align="start" gap={1}>
            <Heading size="xl">Dashboard</Heading>
            <Text color="gray.600">Bem-vindo, {user.nome}!</Text>
          </VStack>
          <Button onClick={() => logout()} variant="outline">
            Sair
          </Button>
        </Flex>

        <Card.Root>
          <Card.Header>
            <Heading size="md">Informações do Usuário</Heading>
          </Card.Header>
          <Card.Body>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <Box>
                <Text fontSize="sm" color="gray.600">Nome</Text>
                <Text fontWeight="medium">{user.nome}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600">Nome de usuário</Text>
                <Text fontWeight="medium">{user.usuario}</Text>
              </Box>
            </Grid>
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Heading size="md">Pesquisar Avaliações de IMC</Heading>
          </Card.Header>
          <Card.Body>
            <Stack gap={4}>
              <Input
                placeholder="Digite para pesquisar suas avaliações..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {isLoadingUserExams || isSearching ? (
                <Flex justify="center" py={8}>
                  <Spinner size="lg" />
                </Flex>
              ) : examsToShow && examsToShow.length > 0 ? (
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
                  {examsToShow.map((exam) => (
                    <ExamCard key={exam.id} exam={exam} />
                  ))}
                </Grid>
              ) : searchQuery ? (
                <Box p={3} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
                  <Text color="blue.600">
                    Nenhuma avaliação encontrada para "{searchQuery}"
                  </Text>
                </Box>
              ) : (
                <Box p={3} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
                  <Text color="blue.600">
                    Você ainda não possui avaliações de IMC cadastradas.
                  </Text>
                </Box>
              )}
            </Stack>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Container>
  )
}
