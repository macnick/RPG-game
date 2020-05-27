const createGame = async () => {
  const name = JSON.stringify({ name: 'Dark Forest' });
  let url =
    'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/';
  const data = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: name,
  };

  const key = await fetch(url, data);

  const keyData = await key.json();
  return keyData;
};
