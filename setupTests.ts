import '@testing-library/jest-dom'
import { loadEnvConfig } from '@next/env'
import fetchMock from 'jest-fetch-mock'

fetchMock.enableMocks()
loadEnvConfig(__dirname, true, { info: () => null, error: console.error })
