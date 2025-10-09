'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Container, Spinner, Flex } from '@chakra-ui/react'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token === 'undefined' || token === 'null') {
        localStorage.removeItem('token')
      }
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [isAuthenticated, isLoading, router])

  return (
    <Container maxW="md" py={12}>
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" />
      </Flex>
    </Container>
  )
}
