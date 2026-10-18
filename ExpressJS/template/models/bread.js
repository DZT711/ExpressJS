// In-memory Bread "model" — stand-in for a database model such as Mongoose.
// Provides the static findById(id) API used by the /breads/:breadId route.

const breads = [
  { id: '1', name: 'Sourdough' },
  { id: '2', name: 'Rye' },
  { id: '3', name: 'Baguette' },
  { id: '4', name: 'Ciabatta' },
  { id: '5', name: 'Pumpernickel' },
];

class Bread {
  static findById(id) {
    return Promise.resolve(breads.find((b) => b.id === String(id)) || null);
  }
}

module.exports = Bread;
