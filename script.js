// Firebase config (use your own from Firebase console)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

const form = document.getElementById('itemForm');
const itemsContainer = document.getElementById('itemsContainer');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('itemName').value;
  const desc = document.getElementById('itemDesc').value;
  const imageFile = document.getElementById('itemImage').files[0];

  // Upload image to storage
  const storageRef = storage.ref(`items/${imageFile.name}`);
  await storageRef.put(imageFile);
  const imageUrl = await storageRef.getDownloadURL();

  // Save to Firestore
  await db.collection('items').add({
    name,
    desc,
    imageUrl,
    createdAt: new Date()
  });

  form.reset();
  loadItems();
});

// Load items
async function loadItems() {
  itemsContainer.innerHTML = '';
  const snapshot = await db.collection('items').orderBy('createdAt', 'desc').get();
  snapshot.forEach(doc => {
    const item = doc.data();
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}" />
      <h4>${item.name}</h4>
      <p>${item.desc}</p>
    `;
    itemsContainer.appendChild(card);
  });
}

loadItems();
