const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
  return db.end();
});

describe(" GET /api/topics ", () => {
  test("GET - status:200, responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
        expect(topics.length).toBe(3);
      });
  });
  test("GET - status:404, not found", () => {
    return request(app)
      .get("/api/topics/badrequest")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("invalid URL!");
      });
  });
});

describe("/api/articles", () => {
  test("GET - status:200, responds with an article array of object", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(12);
        expect(articles).toBeInstanceOf(Array);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET - status: 200, responds with a Decending sorted order value ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET - status:404, not found", () => {
    return request(app)
      .get("/api/articlesbadrequest")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("invalid URL!");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET - status: 200 - get an article from the articles table by a specified article_id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((res) => {
        const { result } = res.body;
        expect(result).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          article_id: 2,
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("GET - status: 400, Invalid sort query ", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid sort query!");
      });
  });
  test("GET - status: 404, Not found ", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found!");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET - status: 200, To get comments with valid article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            article_id: 1,
            votes: expect.any(Number),
          });
        });
      });
  });
  test("GET - status: 200, valid article Id but comment not found", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
  test("GET - status: 404, valid but non-existing article Id", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Article not found!");
      });
  });
  test("GET - status: 400, invalid article Id!", () => {
    return request(app)
      .get("/api/articles/notId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid article Id!");
      });
  });
});

describe(" POST /api/articles/:article_id/comments", () => {
  test("POST - status: 201, for valid id and responds with post comment", () => {
    const sentComment = {
      username: "lurker",
      body: "exceptional piece of work",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(sentComment)
      .expect(201)
      .then(({ body }) => {
        const expected = body.comment;
        expect(expected).toMatchObject({
          body: expect.any(String),
          article_id: 1,
          author: "lurker",
          votes: expect.any(Number),
          created_at: expect.any(String),
          comment_id: expect.any(Number),
        });
      });
  });
  test("POST - status: 404, Bad Request", () => {
    const sentComment = {
      username: "lurker",
      body: "Nice work northcoders!",
    };
    return request(app)
      .post("/api/articles/-1/comments")
      .send(sentComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found!");
      });
  });
  test("POST - status: 400, ", () => {
    const sentComment = {};
    return request(app)
      .post("/api/articles/1/comments")
      .send(sentComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST - status: 404, Username not found ", () => {
    const sentComment = {
      username: "onesi",
      body: "What a good book",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(sentComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username not found!");
      });
  });
  test("POST - status: 400, invalid article Id!", () => {
    const sentComment = {
      username: "lurker",
      body: "What a good book",
    };
    return request(app)
      .post("/api/articles/notId/comments")
      .send(sentComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid article Id!");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  const votesIncrement = { inc_votes: 10 };
  test("PATCH - status: 201, should update votes of article id", () => {
    return request(app)
      .patch("/api/articles/1")
      .send(votesIncrement)
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          body: expect.any(String),
          article_id: 1,
          author: "butter_bridge",
          votes: 110,
          created_at: expect.any(String),
        });
      });
  });
  test("PATCH - status: 400, should return 400 bad request when malformed body", () => {
    const votesIncrement = {};
    return request(app)
      .patch("/api/articles/1")
      .send(votesIncrement)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
  test("PATCH -status:400, should return bad request when body has incorrect data type", () => {
    const votesIncrement = { inc_votes: "lol" };
    return request(app)
      .patch("/api/articles/2")
      .send(votesIncrement)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request wrong data type!");
      });
  });
  test("PATCH -status:400, should return Bad request, wrong data type when article id is not a number!", () => {
    const votesIncrement = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/joker")
      .send(votesIncrement)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
  test("PATCH -status:400, should return article id not found!", () => {
    const votesIncrement = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/-1")
      .send(votesIncrement)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found!");
      });
  });
});
