import { isEmpty } from '../src/index'

describe('is.ts', () => {
  it('should isEmpty func work', () => {
    expect(isEmpty('')).toBeTruthy()
    expect(isEmpty(undefined)).toBeTruthy()
    expect(isEmpty(null)).toBeTruthy()
    expect(isEmpty(0)).toBeFalsy()
    expect(isEmpty({ test: 1 })).toBeFalsy()
  })
})
