import fetch from 'node-fetch'

test('expect', async () => {
  const f = await fetch('http://react.c0d3.com', {
    method: 'GET',
    headers: {
      Authorization: 'hello'
    }
  }).then(res => console.log(res.headers))
  expect('hey').toBe('hey')
})
