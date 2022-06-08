const app = require("../src/app");
const request = require("supertest");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const mock = new MockAdapter(axios);
const { expect } = require("@jest/globals");

const noCacheHeader = {"x-apicache-bypass": true};
//const apiUrl = "https://app.hatchways.io/api/assessment/blog/posts";
let apiUrl = "https://api.hatchways.io/assessment/blog/posts";

describe("All routes tests", () => {

  describe("GET /api/ping (Step 1)", () => {
  
    it("Should respond with status code 200", (done) => {
      request(app)
        .get('/api/ping')
        .set(noCacheHeader)
        .expect(200).end(done);
    });
    
    it("Should respond with body { success: true }", (done) => {
      request(app)
        .get('/api/ping')
        .set(noCacheHeader)
        .expect({ "success": true }).end(done);
    });
  });

  describe("GET /api/posts (Step 2)", () => {
    const hasTag = (post) => post.tags.includes('health');
    const hasTags = (post) => post.tags.includes('health') || post.tags.includes('tech');
    
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
      console.log('listOfParam', listOfParam);
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
    
    describe("Check StatusCode 400", () => {
      
      it("It should respond with status code 400 if `tags` parameter is not present", (done) => {
        request(app)
          .get('/api/posts')
          .expect(400).end(done);
      });
      it("It should respond with status code 400 if a `sortBy` is invalid value", (done) => {
        request(app)
          .get('/api/posts/health/lik')
          .expect(400).end(done);
      });
      it("It should respond with status code 400 if a `direction` is invalid value", (done) => {
        request(app)
          .get('/api/posts/health/likes/de')
          .expect(400).end(done);
      });
    });

    describe("Check status 200 and correct values with one tag", () => {
      it("It should respond with status 200 and posts with unique ids and correct tag sorted by id", () => {
        let apiCur = apiUrl.concat("?tag=health");
        mock.onGet(apiCur).reply(200, {posts: [{id: 1, tags: ["health", "tech"]}, {id: 2, tags: ["health"]}]});
        return request(app)
          .get('/api/posts/health')
          .set(noCacheHeader)
          .then(response => {
            const posts = JSON.parse(response.text).posts;
 
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
      it.only("It should respond with status 200 and posts with unique ids and correct tags sorted by default", () => {
        let apiCur1 = apiUrl.concat("?tag=health");
        let apiCur2 = apiUrl.concat("?tag=tech");
        mock.onGet(apiCur1).reply(200, {posts: [{id: 11, tags: ["health"]}, {id: 11, tags: ["health"]}, {id: 22, tags: ["history", "health"]}]});
        mock.onGet(apiCur2).reply(200, {posts: [{id: 3, tags: ["tech"]}, {id: 4, tags: ["history", "tech"]}]});
       
        return request(app)
          .get('/api/posts/health,tech')
          .set(noCacheHeader)
          .then(response => {
            const posts = JSON.parse(response.text).posts;
            console.log('posts', posts)
           
            expect(response.status).toEqual(200);
            expect(posts.every(hasTags)).toBeTruthy();
            expect(hasUniqueIds(posts)).toBeTruthy();
            expect(isSortedBy(posts, "id", "asc")).toBeTruthy();
          });
      });
     
      it("It should respond with status 200 and posts sorted by sortBy parameter and default direction", () => {
        let apiCur1 = apiUrl.concat("?tag=health&sortBy=likes");
        let apiCur2 = apiUrl.concat("?tag=history&sortBy=likes");
        mock.onGet(apiCur1).reply(200, {posts: [{likes: 1, tags: ["health"]}, {likes: 22, tags: ["tech", "health"]}]});
        mock.onGet(apiCur2).reply(200, {posts: [{likes: 3, tags: ["history"]}, {likes: 44, tags: ["history", "tech"]}]});
        return request(app)
          .get('/api/posts/health,history/likes')
          .then(response => {
            const posts = JSON.parse(response.text).posts;
            // console.log(posts)
            
            expect(response.status).toEqual(200);
            expect(isSortedBySortParameter()).toBeTruthy();
          });
      });
      it("It should respond with status 200 and sorted (by sortBy parameter and asc direction) posts with two tags", () => {
        let apiCur1 = apiUrl.concat("?tag=health&sortBy=likes");
        let apiCur2 = apiUrl.concat("?tag=history&sortBy=likes");
        mock.onGet(apiCur1).reply(200, {posts: [{likes: 1, tags: ["health"]}, {likes: 22, tags: ["tech", "health"]}]});
        mock.onGet(apiCur2).reply(200, {posts: [{likes: 3, tags: ["history"]}, {likes: 44, tags: ["history", "tech"]}]});
        return request(app)
          .get('/api/posts/health,history/likes/asc')
          .then(response => {
            const posts = JSON.parse(response.text).posts;
        
            //PROMISE!!!
            const isSortedBySortParameter = () => {
              let listOfLikes = [];
              for (let post of posts) {
                listOfLikes.push(post.likes);
              }
              const minLikes = listOfLikes[0];
              if (listOfLikes.every((likes) => likes >= minLikes)) return true;
              else return false;
            };
            
            expect(response.status).toEqual(200);
            expect(isSortedBySortParameter()).toBeTruthy();
          });
      });
      
      it("It should respond with status 200 and sorted (by sortBy parameter and desc direction) posts with two tags", () => {
        return request(app)
          .get('/api/posts/health,history/likes/desc')
          .then(response => {
            const posts = JSON.parse(response.text).posts;

            //PROMISE!!!
            const isSortedBySortParameter = () => {
              let listOfLikes = [];
              posts.forEach((post) => {
                listOfLikes.push(post.likes);
              });
              const maxLikes = listOfLikes[0];
              if (listOfLikes.every((likes) => likes <= maxLikes)) return true;
              else return false;
            };

            expect(response.status).toEqual(200);
            expect(isSortedBySortParameter()).toBeTruthy();
          });
      });
    });

  });
});