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
    
    describe("Check StatusCode", () => {
      
      it("It should respond with status code 400 if `tags` parameter is not present", (done) => {
        request(app)
          .get('/api/posts')
          .expect(400).end(done);
      });

      it("It should respond with status code 400 if a `sortBy` is invalid values", (done) => {
        request(app)
          .get('/api/posts/health/lik')
          .expect(400).end(done);
      });
      it("It should respond with status code 400 if a `direction` is invalid values", (done) => {
        request(app)
          .get('/api/posts/health/likes/de')
          .expect(400).end(done);
      });

      it("It should respond with status code 200 if one `tags` parameter is specified", () => {
        let apiCur = apiUrl.concat("?tag=health");
        mock.onGet(apiCur).reply(200, {posts: {"post1": "data1"}});
        console.log(apiCur);
        return request(app)
          .get('/api/posts/health')
          .set(noCacheHeader)
          .expect(200);
      });
      it("It should respond with status code 200 with one tag if a `sortBy` is specified and has a valid value", () => {
        let apiCur = apiUrl.concat("?tag=health&sortBy=likes");
        mock.onGet(apiCur).reply(200, {"posts": [{"likes": 100},{"likes": 50}]});
        console.log(apiCur);
        return request(app)
          .get('/api/posts/health/likes')
          .set(noCacheHeader)
          .expect(200);
      });
      it("It should respond with status code 200 with one tag if a `direction` is specified and has a valid value", () => {
        let apiCur = apiUrl.concat("?tag=health&sortBy=likes&direction=desc");
        mock.onGet(apiCur).reply(200, {"posts": [{"likes": 100},{"likes": 50}]});
        console.log(apiCur);
        return request(app)
          .get('/api/posts/health/likes/desc')
          .set(noCacheHeader)
          .expect(200);
      });
      it("It should respond with status code 200 if two `tags` parameter are specified", () => {
        let apiCur1 = apiUrl.concat("?tag=health");
        let apiCur2 = apiUrl.concat("?tag=tech");
        mock.onGet(apiCur1).reply(200, {"posts": [{"tags": ["health"]}]});
        mock.onGet(apiCur2).reply(200, {"posts": [{"tags": ["tech"]}]});
        return request(app)
          .get('/api/posts/health,tech')
          .expect(200);
      });
      it("It should respond with status code 200 with two tags if a `sortBy` is specified and has a valid value", () => {
        let apiCur1 = apiUrl.concat("?tag=health&sortBy=likes");
        let apiCur2 = apiUrl.concat("?tag=tech&sortBy=likes");
        mock.onGet(apiCur1).reply(200, {"posts": [{"likes": 100, "tags": ["health"]}]});
        mock.onGet(apiCur2).reply(200, {"posts": [{"likes": 50, "tags": ["tech"]}]});
        return request(app)
          .get('/api/posts/health,tech/likes')
          .expect(200);
      });
      it("It should respond with status code 200 with two tags if a `direction` is specified and has a valid value", () => {
        let apiCur1 = apiUrl.concat("?tag=health&sortBy=likes&direction=desc");
        let apiCur2 = apiUrl.concat("?tag=tech&sortBy=likes&direction=desc");
        mock.onGet(apiCur1).reply(200, {"posts": [{"likes": 100, "direction": "desc", "tags": ["health"]}]});
        mock.onGet(apiCur2).reply(200, {"posts": [{"likes": 50, "direction": "desc", "tags": ["tech"]}]});
        return request(app)
          .get('/api/posts/health,tech/likes/desc')
          .expect(200);
      });
    });
   
    it("It should respond with status code 200 if three `tags` parameter are specified", () => {
      let apiCur1 = apiUrl.concat("?tag=health");
      let apiCur2 = apiUrl.concat("?tag=tech");
      let apiCur3 = apiUrl.concat("?tag=history");
      mock.onGet(apiCur1).reply(200, {"posts": [{"likes": 100, "direction": "desc", "tags": ["health"]}]});
      mock.onGet(apiCur2).reply(200, {"posts": [{"likes": 50, "direction": "desc", "tags": ["tech"]}]});
      mock.onGet(apiCur3).reply(200, {"posts": [{"likes": 500, "direction": "desc", "tags": ["history"]}]});
      return request(app)
        .get('/api/posts/health,tech,history')
        .expect(200);
    });

    // describe("Check correct values with one tag", () => {
    //   it("It should respond with posts with correct tag if the tag is specified", () => {
    //     return request(app)
    //       .get('/api/posts/health')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const hasTag = (post) => post.tags.includes('health');
    //         expect(posts.every(hasTag)).toEqual(true);
    //       });
    //   });
    //   it("It should respond with posts with unique ids when one tag is specified", () => {
    //     return request(app)
    //       .get('/api/posts/health')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const hasUniqueIds = () => {
    //           let idHash = {};
    //           posts.forEach((post) => {
    //             if (idHash[post.id]) return false;
    //             else idHash[post.id] = 1;
    //           });
    //           return true;
    //         };
    //         expect(hasUniqueIds()).toEqual(true);
    //       });
    //   });
    //   it("It should respond with by default sorted (by ids) posts with only one tag", () => {
    //     return request(app)
    //       .get('/api/posts/health')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const isSortedByIds = () => {
    //           let listOfIds = [];
    //           posts.forEach((post) => {
    //             listOfIds.push(post.id);
    //           });
    //           const minId = listOfIds[0];
    //           if (listOfIds.every((id) => id >= minId)) return true;
    //           else return false;
    //         };
    //         expect(isSortedByIds()).toEqual(true);
    //       });
    //   });
    //   it("It should respond with sorted (by sortBy parameter) posts with only one tag", () => {
    //     return request(app)
    //       .get('/api/posts/health/popularity')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const isSortedBySortParameter = () => {
    //           let listOfPopularities = [];
    //           posts.forEach((post) => {
    //             listOfPopularities.push(post.popularity);
    //           });
    //           const minValue = listOfPopularities[0];
    //           if (listOfPopularities.every((value) => value >= minValue)) return true;
    //           else return false;
    //         };
    //         expect(isSortedBySortParameter()).toEqual(true);
    //       });
    //   });
    //   it("It should respond with sorted (by sortBy parameter and asc direction) posts with only one tag", () => {
    //     return request(app)
    //       .get('/api/posts/health/popularity/asc')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const isSortedBySortParameter = () => {
    //           let listOfPopularities = [];
    //           posts.forEach((post) => {
    //             listOfPopularities.push(post.popularity);
    //           });
    //           const minValue = listOfPopularities[0];
    //           if (listOfPopularities.every((value) => value >= minValue)) return true;
    //           else return false;
    //         };
    //         expect(isSortedBySortParameter()).toEqual(true);
    //       });
    //   });
    //   it("It should respond with sorted (by sortBy parameter and desc direction) posts with only one tag", () => {
    //     return request(app)
    //       .get('/api/posts/health/popularity/desc')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const isSortedBySortParameter = () => {
    //           let listOfPopularities = [];
    //           posts.forEach((post) => {
    //             listOfPopularities.push(post.popularity);
    //           });
    //           const maxValue = listOfPopularities[0];
    //           if (listOfPopularities.every((value) => value <= maxValue)) return true;
    //           else return false;
    //         };
    //         expect(isSortedBySortParameter()).toEqual(true);
    //       });
    //   });
    // });

    // describe("Check correct values with two tags", () => {
    //   it("It should respond with posts with correct tags if two tags are specified", () => {
    //     return request(app)
    //       .get('/api/posts/health,tech')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const hasOneOfTags = (post) => post.tags.includes('health') || post.tags.includes('tech');
    //         expect(posts.every(hasOneOfTags)).toEqual(true);
    //       });
    //   });
    //   it("It should respond with posts with unique ids when two tags are specified", () => {
    //     return request(app)
    //       .get('/api/posts/health,tech')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const hasUniqueIds = () => {
    //           let idHash = {};
    //           posts.forEach((post) => {
    //             if (idHash[post.id]) return false;
    //             else idHash[post.id] = 1;
    //           });
    //           return true;
    //         };
    //         expect(hasUniqueIds()).toEqual(true);
    //       });
    //   });
    //   it("It should respond with by default sorted (by ids) posts with two tags", () => {
    //     return request(app)
    //       .get('/api/posts/health,tech')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const isSortedByIds = () => {
    //           let listOfIds = [];
    //           posts.forEach((post) => {
    //             listOfIds.push(post.id);
    //           });
    //           const minId = listOfIds[0];
    //           if (listOfIds.every((id) => id >= minId)) return true;
    //           else return false;
    //         };
    //         expect(isSortedByIds()).toEqual(true);
    //       });
    //   });
    //   it("It should respond with by default sorted (by ids) posts with two tags", () => {
    //     return request(app)
    //       .get('/api/posts/health,tech')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const isSortedByIds = () => {
    //           let listOfIds = [];
    //           posts.forEach((post) => {
    //             listOfIds.push(post.id);
    //           });
    //           const minId = listOfIds[0];
    //           if (listOfIds.every((id) => id >= minId)) return true;
    //           else return false;
    //         };
    //         expect(isSortedByIds()).toEqual(true);
    //       });
    //   });
    //   it("It should respond with sorted (by sortBy parameter) posts with two tags", () => {
    //     return request(app)
    //       .get('/api/posts/health,history/likes')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const isSortedBySortParameter = () => {
    //           let listOfLikes = [];
    //           posts.forEach((post) => {
    //             listOfLikes.push(post.likes);
    //           });
    //           const minLikes = listOfLikes[0];
    //           if (listOfLikes.every((likes) => likes >= minLikes)) return true;
    //           else return false;
    //         };
    //         expect(isSortedBySortParameter()).toEqual(true);
    //       });
    //   });
    //   it("It should respond with sorted (by sortBy parameter and asc direction) posts with two tags", () => {
    //     return request(app)
    //       .get('/api/posts/health,history/likes/asc')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const isSortedBySortParameter = () => {
    //           let listOfLikes = [];
    //           posts.forEach((post) => {
    //             listOfLikes.push(post.likes);
    //           });
    //           const minLikes = listOfLikes[0];
    //           if (listOfLikes.every((likes) => likes >= minLikes)) return true;
    //           else return false;
    //         };
    //         expect(isSortedBySortParameter()).toEqual(true);
    //       });
    //   });
    //   it("It should respond with sorted (by sortBy parameter and desc direction) posts with two tags", () => {
    //     return request(app)
    //       .get('/api/posts/health,history/likes/desc')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const isSortedBySortParameter = () => {
    //           let listOfLikes = [];
    //           posts.forEach((post) => {
    //             listOfLikes.push(post.likes);
    //           });
    //           const maxLikes = listOfLikes[0];
    //           if (listOfLikes.every((likes) => likes <= maxLikes)) return true;
    //           else return false;
    //         };
    //         expect(isSortedBySortParameter()).toEqual(true);
    //       });
    //   });
    // });

    // describe("Check correct values with three tags", () => {
    //   it("It should respond with posts with correct tags when three tags are specified", () => {
    //     return request(app)
    //       .get('/api/posts/health,tech,history')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const hasOneOfTags = (post) => post.tags.includes('health') || post.tags.includes('tech') || post.tags.includes('history');
    //         expect(posts.every(hasOneOfTags)).toEqual(true);
    //       });
    //   });
    //   it("It should respond with posts with unique ids when three tags are specified", () => {
    //     return request(app)
    //       .get('/api/posts/health,tech,history')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const hasUniqueIds = () => {
    //           let idHash = {};
    //           posts.forEach((post) => {
    //             if (idHash[post.id]) return false;
    //             else idHash[post.id] = 1;
    //           });
    //           return true;
    //         };
    //         expect(hasUniqueIds()).toEqual(true);
    //       });
    //   });
    //   it("It should respond with by default sorted (by ids) posts with three tags", () => {
    //     return request(app)
    //       .get('/api/posts/health,tech,history')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const isSortedByIds = () => {
    //           let listOfIds = [];
    //           posts.forEach((post) => {
    //             listOfIds.push(post.id);
    //           });
    //           const minId = listOfIds[0];
    //           if (listOfIds.every((id) => id >= minId)) return true;
    //           else return false;
    //         };
    //         expect(isSortedByIds()).toEqual(true);
    //       });
    //   });
    //   it("It should respond with by default sorted (by ids) posts with three tags", () => {
    //     return request(app)
    //       .get('/api/posts/health,tech,history')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const isSortedByIds = () => {
    //           let listOfIds = [];
    //           posts.forEach((post) => {
    //             listOfIds.push(post.id);
    //           });
    //           const minId = listOfIds[0];
    //           if (listOfIds.every((id) => id >= minId)) return true;
    //           else return false;
    //         };
    //         expect(isSortedByIds()).toEqual(true);
    //       });
    //   });
    //   it("It should respond with sorted (by sortBy parameter) posts with three tags", () => {
    //     return request(app)
    //       .get('/api/posts/health,tech,history/likes')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const isSortedBySortParameter = () => {
    //           let listOfLikes = [];
    //           posts.forEach((post) => {
    //             listOfLikes.push(post.likes);
    //           });
    //           const minLikes = listOfLikes[0];
    //           if (listOfLikes.every((likes) => likes >= minLikes)) return true;
    //           else return false;
    //         };
    //         expect(isSortedBySortParameter()).toEqual(true);
    //       });
    //   });
    //   it("It should respond with sorted (by sortBy parameter and asc direction) posts with three tags", () => {
    //     return request(app)
    //       .get('/api/posts/health,tech,history/likes/asc')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const isSortedBySortParameter = () => {
    //           let listOfLikes = [];
    //           posts.forEach((post) => {
    //             listOfLikes.push(post.likes);
    //           });
    //           const minLikes = listOfLikes[0];
    //           if (listOfLikes.every((likes) => likes >= minLikes)) return true;
    //           else return false;
    //         };
    //         expect(isSortedBySortParameter()).toEqual(true);
    //       });
    //   });
    //   it("It should respond with sorted (by sortBy parameter and desc direction) posts with three tags", () => {
    //     return request(app)
    //       .get('/api/posts/health,tech,history/likes/desc')
    //       .then(response => {
    //         const posts = JSON.parse(response.text).posts;
    //         const isSortedBySortParameter = () => {
    //           let listOfLikes = [];
    //           posts.forEach((post) => {
    //             listOfLikes.push(post.likes);
    //           });
    //           const maxLikes = listOfLikes[0];
    //           if (listOfLikes.every((likes) => likes <= maxLikes)) return true;
    //           else return false;
    //         };
    //         expect(isSortedBySortParameter()).toEqual(true);
    //       });
    //   });
    // });
  
  });
});
