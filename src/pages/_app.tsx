'use client';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SideBarDrawerProvider } from '../contexts/SideBarDrawerContext';
import theme from '../styles/themes';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Dashgo</title>
      </Head>
      <ChakraProvider theme={theme}>
        <SideBarDrawerProvider>
          <Component {...pageProps} />
        </SideBarDrawerProvider>
    </ChakraProvider>
    </>
   
  )
}
