import Model from '../Model';

describe('The scores should be set and reset', () => {
  it('Should set the score', () => {
    Model.score = 60;
    expect(Model.score).toBe(60);
  })
})
