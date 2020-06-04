import { putScore, getScores } from '../leaderBoard';

describe('The scores should be written and read from the API', () => {
  it('Should post the score', () => {
    putScore('macnick', 100).then(data => {
      expect(data).toBe("Leaderboard score created correctly.");
    })
  })
  it('Should get all the scores from the API', () => {
    getScores().then(data => {
      expect(typeof data).toBe('object');
      expect(data.result).toContainEqual('user');
    })
  })
})