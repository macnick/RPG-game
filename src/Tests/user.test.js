import Model from '../Model';

describe('The username should be set and read', () => {
  it('Should set the user name', () => {
    Model.userName = 'Nick';
    expect(Model.userName).toBe('Nick');
  })

  it('Should get the user name', () => {
    expect(Model.userName).toBe('Nick');
  })
})