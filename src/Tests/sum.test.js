import sum from './sum'

test('add 1 + 2 should equal 3', () => {
  expect(sum(1, 2)).toBe(3);
})