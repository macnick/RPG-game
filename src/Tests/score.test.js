import Model from '../Model';

describe('The scores should be set and read', () => {
  it('Should read the score', () => {
    Model.score = 10;
    expect(Model.score).toBe(10);
  });

  it('Should set the score', () => {
    Model.score = 60;
    expect(Model.score).toBe(60);
  });
});
