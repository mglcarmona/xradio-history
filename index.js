const axios = require('axios');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

const URL = 'https://public.radio.co/stations/s83d70ae1d/status';
const WAIT_TIME = 1000 * 60 * 5;

const mapHistory = arr => arr.map(({ title }) => title);

const getRadioHistory = (cb) => {
  axios
    .get(URL)
    .then(res => res.data)
    .then(({ history }) => {
      cb(mapHistory(history))
    })
    .catch(err => console.log('Err: ', err));
}

setInterval(() => {
  const dbTracks = db.get('tracks');

  getRadioHistory((currentHistory) => {
    const tracks = dbTracks.value();
    const newTracksState = new Set([...currentHistory, ...tracks]);
    const newState = { tracks: [...newTracksState] };

    console.log('Current history: ', currentHistory)
    db.setState(newState).write();
  })
}, WAIT_TIME);