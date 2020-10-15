const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../../server');
const { mongodbUri, redisClient } = require('../../../util');

afterEach(() => {
  jest.clearAllMocks();
});

beforeAll(async () => {
  await mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(() => {
  mongoose.disconnect();
  redisClient.quit();
});


describe('/api/races', () => {
  it('should list races', async () => {
    const res = await request(app).get('/api/races');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/races');
      const name = indexRes.body.results[1].name;
      const res = await request(app).get(`/api/races?name=${name}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/races');
      const name = indexRes.body.results[1].name;
      const queryName = name.toLowerCase();
      const res = await request(app).get(`/api/races?name=${queryName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });
  });

  describe('/api/races/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/races');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/races/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });

    describe('with an invalid index', () => {
      it('should return one object', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/races/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });

    describe('/api/races/:index/subraces', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/races');
        const index = indexRes.body.results[1].index;
        const res = await request(app).get(`/api/races/${index}/subraces`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.results.length).not.toEqual(0);
      });
    });

    describe('/api/races/:index/proficiencies', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/races');
        const index = indexRes.body.results[1].index;
        const res = await request(app).get(`/api/races/${index}/proficiencies`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.results.length).not.toEqual(0);
      });
    });

    describe('/api/races/:index/traits', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/races');
        const index = indexRes.body.results[1].index;
        const res = await request(app).get(`/api/races/${index}/traits`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.results.length).not.toEqual(0);
      });
    });
  });
});
