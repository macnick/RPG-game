import Model from '../Model';

it('Should set the score', () => {
  Model.score = 60;
  expect(Model.score).toBe(60);
})

it('Should reset the score', () => {
  // Model.score = 60;
  Model.resetScore();
  expect(Model.score).toBe(0);
})