import { hashPass } from '../helpers/crypto'
import { sendRequest } from '../helpers/httpRequest'

describe('helpers', () => {
  describe('httpRequest function', () => {
    it('Should return 200', async () => {
      const url = 'https://jsonplaceholder.typicode.com/todos/1'
      const result = {
        completed: false,
        id: 1,
        title: 'delectus aut autem',
        userId: 1
      }
      const request = await sendRequest(url, {})
      expect(request).toBeInstanceOf(Object)
      expect(request).toEqual(result)
    })
  })

  describe('crypto function', () => {
    it('Should hash password', () => {
      expect(hashPass('password')).toBe(
        '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
      )
    })
  })
})
