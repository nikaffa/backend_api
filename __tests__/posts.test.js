const app = require("../src/app");
const request = require("supertest");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const mock = new MockAdapter(axios);
const { expect } = require("@jest/globals");

const noCacheHeader = {"x-apicache-bypass": true};
let apiUrl = "https://api.hatchways.io/assessment/blog/posts";

describe("All routes tests", () => {

  describe("GET /api/ping (Step 1)", () => {
    it("Should respond with status code 200 and body { success: true }", () => {
      return request(app)
        .get('/api/ping')
        .set(noCacheHeader)
        .expect(200, { success: true });
    });
  });

  describe("GET /api/posts (Step 2)", () => {
    
    //Test Helpers
    const hasUniqueIds = (posts) => {
      let idHash = {};
      for (let post of posts) {
        if (idHash[post.id]) return false;
        else idHash[post.id] = 1;
      }
      return true;
    };
    
    const isSortedBy = (posts, prmtr, dir) => {
      let listOfParam = [];
      for (let post of posts) {
        listOfParam.push(post[prmtr]);
      }
      if (dir === "asc") {
        const min = listOfParam[0];
        if (listOfParam.every((id) => id >= min)) return true;
        else return false;
      } else {
        const max = listOfParam[0];
        if (listOfParam.every((id) => id <= max)) return true;
        else return false;
      }
    };
    
    describe("Check StatusCode 400 when Error", () => {
      
      it("It should respond with status code 400 if `tags` parameter is not present", () => {
        return request(app)
          .get('/api/posts')
          .expect(400);
      });
      it("It should respond with status code 400 if a `sortBy` is invalid value", () => {
        return request(app)
          .get('/api/posts/health/lik')
          .expect(400);
      });
      it("It should respond with status code 400 if a `direction` is invalid value", () => {
        return request(app)
          .get('/api/posts/health/likes/de')
          .expect(400);
      });
    });

    describe("Check status 200 and correct values with one tag", () => {
      it("It should respond with status 200 and posts with unique ids and correct tag sorted by default", () => {
        let apiCur = apiUrl.concat("?tag=health");
        mock.onGet(apiCur).reply(200, {posts: [{id: 1, tags: ["health", "tech"]}, {id: 2, tags: ["health"]}]});
        return request(app)
          .get('/api/posts/health')
          .set(noCacheHeader)
          .then(response => {
            const posts = JSON.parse(response.text).posts;
            const hasTag = (post) => post.tags.includes('health');
 
            expect(response.status).toEqual(200);
            expect(posts.every(hasTag)).toBeTruthy();
            expect(hasUniqueIds(posts)).toBeTruthy();
            expect(isSortedBy(posts, "id", "asc")).toBeTruthy();
          });
      });
      it("It should respond with status 200 and posts sorted by sortBy parameter and default direction", () => {
        let apiCur = apiUrl.concat("?tag=health&sortBy=popularity");
        mock.onGet(apiCur).reply(200, {posts: [{popularity: 11}, {popularity: 5}]});
        return request(app)
          .get('/api/posts/health/popularity')
          .set(noCacheHeader)
          .then(response => {
            const posts = JSON.parse(response.text).posts;
            expect(response.status).toEqual(200);
            expect(isSortedBy(posts, "popularity", "asc")).toBeTruthy();
          });
      });
      it("It should respond with status 200 and posts sorted by sortBy parameter and asc direction", () => {
        let apiCur = apiUrl.concat("?tag=health&sortBy=popularity&direction=asc");
        mock.onGet(apiCur).reply(200, {posts: [{popularity: 11},{popularity: 5}]});
        return request(app)
          .get('/api/posts/health/popularity/asc')
          .set(noCacheHeader)
          .then(response => {
            const posts = JSON.parse(response.text).posts;
            expect(response.status).toEqual(200);
            expect(isSortedBy(posts, "popularity", "asc")).toBeTruthy();
          });
      });
      it("It should respond with status 200 and posts sorted by sortBy parameter and desc direction", () => {
        let apiCur = apiUrl.concat("?tag=health&sortBy=popularity&direction=desc");
        mock.onGet(apiCur).reply(200, {posts: [{popularity: 5},{popularity: 11}]});
        return request(app)
          .get('/api/posts/health/popularity/desc')
          .set(noCacheHeader)
          .then(response => {
            const posts = JSON.parse(response.text).posts;
            expect(response.status).toEqual(200);
            expect(isSortedBy(posts, "popularity", "desc")).toBeTruthy();
          });
      });
    });

    describe("Check status 200 and correct values with two tags", () => {
      it("It should respond with status 200 and posts with unique ids and correct tags sorted by default", () => {
        let apiCur1 = apiUrl.concat("?tag=health");
        let apiCur2 = apiUrl.concat("?tag=tech");
        mock.onGet(apiCur1).reply(200, {posts: [{id: 11, tags: ["health"]}, {id: 11, tags: ["health"]}, {id: 22, tags: ["history", "health"]}]});
        mock.onGet(apiCur2).reply(200, {posts: [{id: 3, tags: ["tech"]}, {id: 4, tags: ["history", "tech"]}]});
       
        return request(app)
          .get('/api/posts/health,tech')
          .set(noCacheHeader)
          .then(response => {
            const posts = JSON.parse(response.text).posts;
            const hasTags = (post) => post.tags.includes('health') || post.tags.includes('tech');
           
            expect(response.status).toEqual(200);
            expect(posts.every(hasTags)).toBeTruthy();
            expect(hasUniqueIds(posts)).toBeTruthy();
            expect(isSortedBy(posts, "id", "asc")).toBeTruthy();
          });
      });
      it("It should respond with status 200 and posts sorted by sortBy parameter and default direction", () => {
        let apiCur1 = apiUrl.concat("?tag=health&sortBy=likes");
        let apiCur2 = apiUrl.concat("?tag=history&sortBy=likes");
        mock.onGet(apiCur1).reply(200, {posts: [{id: 11, likes: 1, tags: ["health"]}, {id: 12, likes: 22, tags: ["history", "health"]}]});
        mock.onGet(apiCur2).reply(200, {posts: [{id: 12, likes: 22, tags: ["history", "health"]}, {id: 13, likes: 3, tags: ["history"]}, {id: 14, likes: 44, tags: ["history", "tech"]}]});
        return request(app)
          .get('/api/posts/health,history/likes')
          .then(response => {
            const posts = JSON.parse(response.text).posts;
            
            expect(response.status).toEqual(200);
            expect(isSortedBy(posts, "likes", "asc")).toBeTruthy();
          });
      });
      it("It should respond with status 200 and posts sorted by sortBy parameter and asc direction", () => {
        let apiCur1 = apiUrl.concat("?tag=health&sortBy=likes&direction=asc");
        let apiCur2 = apiUrl.concat("?tag=history&sortBy=likes&direction=asc");
        mock.onGet(apiCur1).reply(200, {posts: [{id: 11, likes:44, tags: ["health"]}, {id: 12, likes: 22, tags: ["history", "health"]}]});
        mock.onGet(apiCur2).reply(200, {posts: [{id: 12, likes: 22, tags: ["history", "health"]}, {id: 13, likes: 1, tags: ["history"]}, {id: 14, likes: 3, tags: ["history", "tech"]}]});
        return request(app)
          .get('/api/posts/health,history/likes/asc')
          .then(response => {
            const posts = JSON.parse(response.text).posts;
            
            expect(response.status).toEqual(200);
            expect(isSortedBy(posts, "likes", "asc")).toBeTruthy();
          });
      });
      it("It should respond with status 200 and posts sorted by sortBy parameter and desc direction", () => {
        let apiCur1 = apiUrl.concat("?tag=health&sortBy=likes&direction=desc");
        let apiCur2 = apiUrl.concat("?tag=history&sortBy=likes&direction=desc");
        mock.onGet(apiCur1).reply(200, {posts: [{id: 11, likes:4, tags: ["health"]}, {id: 12, likes: 22, tags: ["history", "health"]}]});
        mock.onGet(apiCur2).reply(200, {posts: [{id: 12, likes: 22, tags: ["history", "health"]}, {id: 13, likes: 1, tags: ["history"]}, {id: 14, likes: 3, tags: ["history", "tech"]}]});
        return request(app)
          .get('/api/posts/health,history/likes/desc')
          .then(response => {
            const posts = JSON.parse(response.text).posts;
            
            expect(response.status).toEqual(200);
            expect(isSortedBy(posts, "likes", "desc")).toBeTruthy();
          });
      });
    });

  });
});