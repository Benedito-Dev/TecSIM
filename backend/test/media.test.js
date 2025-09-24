const media = require('./media');

test('media de [1, 2, 3] é 2', () => {
    expect(media([1, 2, 3])).toBe(2);
})

test('media de [] é 0', () => {
    expect(media([])).toBe(0);
});