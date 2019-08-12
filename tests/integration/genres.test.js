const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');

let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => {
        server.close();
        await Genre.remove({}); // Cleanup the db 
    });
    describe('GET /', () => {
        it('Should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1'},
                { name: 'genre2'},
                { name: 'genre3'},
            ])
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre3')).toBeTruthy();
        });
    });
    describe('GET /:id', () => {
        it('Should return a genres if valid id is passed', async () => {
            const genre = new Genre(
                { name: 'genre1'},
            )
            await genre.save();
            const res = await request(server).get(`/api/genres/${genre._id}`);
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            // expect(res.body).toMatchObject(genre); // This will fail due to _id mismatch
            expect(res.body[0]).toHaveProperty('name', genre.name);
        });

        it('Should return a 404 error if invalid id is passed', async () => {

            const res = await request(server).get('/api/genres/12345');
            expect(res.status).toBe(404);
        });
    });
    describe('POST /', () => {
        it('should return 401 error if client does not log in', async () => {
            const res = await request(server)
                .post('/api/genres')
                .send({ name: 'genre1' })
            expect(res.status).toBe(401);
        });
        it('should return 400 error if genre is less than 5 characters', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: 'gen1' })
            expect(res.status).toBe(400);
        });
        it('should return 400 error if genre is more than 50 characters', async () => {
            const token = new User().generateAuthToken();
            const name = new Array(52).join('a');
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: name })
            expect(res.status).toBe(400);
        });
        it('should save the genre to database', () => {

        });
        it('should return genre object if input data is valid', () => {

        });
    })
});