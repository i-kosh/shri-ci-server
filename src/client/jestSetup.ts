import '@testing-library/jest-dom'
import { Headers, Request, Response, fetch } from 'cross-fetch'

globalThis.fetch = fetch
globalThis.Response = Response
globalThis.Request = Request
globalThis.Headers = Headers
