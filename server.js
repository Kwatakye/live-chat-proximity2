const express = require('express');
const Pusher = require('pusher');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const pusher = new Pusher({
  appId: "1879267",
  key: "3e4976fd0223f8ea9030",
  secret: "143b814cd199fbc0645c",
  cluster: "us2",
  useTLS: true
});

let users = [];

app.post('/update-user', (req, res) => {
  const user = req.body;
  const index = users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
  } else {
    users.push(user);
  }
  pusher.trigger('proximity-chat', 'user-update', { users });
  res.sendStatus(200);
});

app.post('/scan-users', (req, res) => {
  const { userId } = req.body;
  const currentUser = users.find(u => u.id === userId);
  if (currentUser) {
    const nearbyUsers = users.filter(u => {
      if (u.id === userId) return false;
      const distance = calculateDistance(currentUser.lat, currentUser.lon, u.lat, u.lon);
      return distance <= 45.72; // 150 feet in meters
    });
    pusher.trigger('proximity-chat', 'user-update', { users: nearbyUsers });
  }
  res.sendStatus(200);
});

app.post('/send-message', (req, res) => {
  const { sender, recipient, message } = req.body;
  pusher.trigger('proximity-chat', 'chat-message', { sender, recipient, message });
  res.sendStatus(200);
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});