test("GET - status 200, responds with a sorted order value ", () => {
  return request(app)
    .get("/api/articles?sort_by=created_at")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toBeSortedBy("created_at", { descending: true });
    });
});
test("GET - status 400, Invalid sort query ", () => {
  return request(app)
    .get("/api/articles?sort_by=created_at; DROP TABLE articles")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("invalid sort query!");
    });
});
