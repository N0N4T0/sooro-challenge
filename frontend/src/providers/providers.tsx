'use client'

import { ReactNode } from 'react'
import { ChakraUIProvider } from './chakra-provider'
import { QueryProvider } from './query-provider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ChakraUIProvider>
        {children}
      </ChakraUIProvider>
    </QueryProvider>
  )
}
