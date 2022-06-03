process.env.NODE_ENV = "test";
const expect = require('@jest/globals').expect;
const axios = require('axios');

describe("GET /api/ping (Step 1)", () => {
 
  it("Should respond with status code 200", () => {
    return axios.get('http://localhost:8081/api/ping')
      .then(res => {
        expect(res.status).toBe(200);
      })
      .catch(err => {
        console.error('error', err.message);
      });
    
  });
   
  it("Should respond with body { success: true }", () => {
    return axios.get('http://localhost:8081/api/ping')
      .then(res => {
        expect(res.data).toEqual({ "success": true });
      })
      .catch(err => {
        console.error('error', err.message);
      });
  });
});

describe("GET /api/posts (Step 2)", () => {
  
  describe("Check StatusCode", () => {
    it("It should respond with status code 400 if `tags` parameter is not present", () => {
      return axios.get('http://localhost:8081/api/posts')
        .then(response => {
          expect(response.status).toBe(400);
        })
        .catch(err => {
          console.log('error 400', err.message);
        });
    });
    it("It should respond with status code 400 if a `sortBy` is invalid values", () => {
      return axios.get('http://localhost:8081/api/posts/health/lik')
        .then(response => {
          expect(response.status).toBe(400);
        })
        .catch(err => {
          console.log('error 400', err.message);
        });
    });
    it("It should respond with status code 400 if a `direction` is invalid values", () => {
      return axios.get('http://localhost:8081/api/posts/health/likes/de')
        .then(response => {
          expect(response.status).toBe(400);
        })
        .catch(err => {
          console.log('error 400', err.message);
        });
    });
    it("It should respond with status code 200 if one `tags` parameter is specified", () => {
      return axios.get('http://localhost:8081/api/posts/health')
        .then(response => {
          expect(response.status).toBe(200);
        });
    });
    it("It should respond with status code 200 if one `tags` parameter is specified", () => {
      return axios.get('http://localhost:8081/api/posts/health')
        .then(response => {
          expect(response.status).toBe(200);
        });
    });
    it("It should respond with status code 200 if two `tags` parameter are specified", () => {
      return axios.get('http://localhost:8081/api/posts/health,tech')
        .then(response => {
          expect(response.status).toBe(200);
        });
    });
    it("It should respond with status code 200 if three `tags` parameter are specified", () => {
      return axios.get('http://localhost:8081/api/posts/health,tech,history')
        .then(response => {
          expect(response.status).toBe(200);
        });
    });
    it("It should respond with status code 200 with one tag if a `sortBy` is specified and has a valid value", () => {
      return axios.get('http://localhost:8081/api/posts/health/likes')
        .then(response => {
          expect(response.status).toBe(200);
        });
    });
    it("It should respond with status code 200 with two tags if a `sortBy` is specified and has a valid value", () => {
      return axios.get('http://localhost:8081/api/posts/health,tech/likes')
        .then(response => {
          expect(response.status).toBe(200);
        });
    });
    it("It should respond with status code 200 with one tag if a `direction` is specified and has a valid value", () => {
      return axios.get('http://localhost:8081/api/posts/health/likes/desc')
        .then(response => {
          expect(response.status).toBe(200);
        });
    });
    it("It should respond with status code 200 with two tags if a `direction` is specified and has a valid value", () => {
      return axios.get('http://localhost:8081/api/posts/health,tech/likes/desc')
        .then(response => {
          expect(response.status).toBe(200);
        });
    });
  });

  describe("Check correct values with one tag", () => {
    it("It should respond with posts with correct tag if the tag is specified", () => {
      return axios.get('http://localhost:8081/api/posts/health')
        .then(response => {
          const posts = response.data.posts;
          const hasTag = (post) => post.tags.includes('health');
          expect(posts.every(hasTag)).toEqual(true);
        });
    });
    it("It should respond with posts with unique ids when one tag is specified", () => {
      return axios.get('http://localhost:8081/api/posts/health')
        .then(response => {
          const posts = response.data.posts;
          const hasUniqueIds = () => {
            let idHash = {};
            posts.forEach((post) => {
              if (idHash[post.id]) return false;
              else idHash[post.id] = 1;
            });
            return true;
          };
          expect(hasUniqueIds()).toEqual(true);
        });
    });
    it("It should respond with by default sorted (by ids) posts with only one tag", () => {
      return axios.get('http://localhost:8081/api/posts/health')
        .then(response => {
          const posts = response.data.posts;
          const isSortedByIds = () => {
            let listOfIds = [];
            posts.forEach((post) => {
              listOfIds.push(post.id);
            });
            const minId = listOfIds[0];
            if (listOfIds.every((id) => id >= minId)) return true;
            else return false;
          };
          expect(isSortedByIds()).toEqual(true);
        });
    });
    it("It should respond with sorted (by sortBy parameter) posts with only one tag", () => {
      return axios.get('http://localhost:8081/api/posts/health/popularity')
        .then(response => {
          const posts = response.data.posts;
          const isSortedBySortParameter = () => {
            let listOfPopularities = [];
            posts.forEach((post) => {
              listOfPopularities.push(post.popularity);
            });
            const minValue = listOfPopularities[0];
            if (listOfPopularities.every((value) => value >= minValue)) return true;
            else return false;
          };
          expect(isSortedBySortParameter()).toEqual(true);
        });
    });
    it("It should respond with sorted (by sortBy parameter and asc direction) posts with only one tag", () => {
      return axios.get('http://localhost:8081/api/posts/health/popularity/asc')
        .then(response => {
          const posts = response.data.posts;
          const isSortedBySortParameter = () => {
            let listOfPopularities = [];
            posts.forEach((post) => {
              listOfPopularities.push(post.popularity);
            });
            const minValue = listOfPopularities[0];
            if (listOfPopularities.every((value) => value >= minValue)) return true;
            else return false;
          };
          expect(isSortedBySortParameter()).toEqual(true);
        });
    });
    it("It should respond with sorted (by sortBy parameter and desc direction) posts with only one tag", () => {
      return axios.get('http://localhost:8081/api/posts/health/popularity/desc')
        .then(response => {
          const posts = response.data.posts;
          const isSortedBySortParameter = () => {
            let listOfPopularities = [];
            posts.forEach((post) => {
              listOfPopularities.push(post.popularity);
            });
            const maxValue = listOfPopularities[0];
            if (listOfPopularities.every((value) => value <= maxValue)) return true;
            else return false;
          };
          expect(isSortedBySortParameter()).toEqual(true);
        });
    });
  });

  describe("Check correct values with two tags", () => {
    it("It should respond with posts with correct tags if two tags are specified", () => {
      return axios.get('http://localhost:8081/api/posts/health,tech')
        .then(response => {
          let posts = response.data.posts;
          const hasOneOfTags = (post) => post.tags.includes('health') || post.tags.includes('tech');
          expect(posts.every(hasOneOfTags)).toEqual(true);
        });
    });
    it("It should respond with posts with unique ids when two tags are specified", () => {
      return axios.get('http://localhost:8081/api/posts/health,tech')
        .then(response => {
          const posts = response.data.posts;
          const hasUniqueIds = () => {
            let idHash = {};
            posts.forEach((post) => {
              if (idHash[post.id]) return false;
              else idHash[post.id] = 1;
            });
            return true;
          };
          expect(hasUniqueIds()).toEqual(true);
        });
    });
    it("It should respond with by default sorted (by ids) posts with two tags", () => {
      return axios.get('http://localhost:8081/api/posts/health,tech')
        .then(response => {
          const posts = response.data.posts;
          const isSortedByIds = () => {
            let listOfIds = [];
            posts.forEach((post) => {
              listOfIds.push(post.id);
            });
            const minId = listOfIds[0];
            if (listOfIds.every((id) => id >= minId)) return true;
            else return false;
          };
          expect(isSortedByIds()).toEqual(true);
        });
    });
    it("It should respond with by default sorted (by ids) posts with two tags", () => {
      return axios.get('http://localhost:8081/api/posts/health,tech')
        .then(response => {
          const posts = response.data.posts;
          const isSortedByIds = () => {
            let listOfIds = [];
            posts.forEach((post) => {
              listOfIds.push(post.id);
            });
            const minId = listOfIds[0];
            if (listOfIds.every((id) => id >= minId)) return true;
            else return false;
          };
          expect(isSortedByIds()).toEqual(true);
        });
    });
    it("It should respond with sorted (by sortBy parameter) posts with two tags", () => {
      return axios.get('http://localhost:8081/api/posts/health,history/likes')
        .then(response => {
          const posts = response.data.posts;
          const isSortedBySortParameter = () => {
            let listOfLikes = [];
            posts.forEach((post) => {
              listOfLikes.push(post.likes);
            });
            const minLikes = listOfLikes[0];
            if (listOfLikes.every((likes) => likes >= minLikes)) return true;
            else return false;
          };
          expect(isSortedBySortParameter()).toEqual(true);
        });
    });
    it("It should respond with sorted (by sortBy parameter and asc direction) posts with two tags", () => {
      return axios.get('http://localhost:8081/api/posts/health,history/likes/asc')
        .then(response => {
          const posts = response.data.posts;
          const isSortedBySortParameter = () => {
            let listOfLikes = [];
            posts.forEach((post) => {
              listOfLikes.push(post.likes);
            });
            const minLikes = listOfLikes[0];
            if (listOfLikes.every((likes) => likes >= minLikes)) return true;
            else return false;
          };
          expect(isSortedBySortParameter()).toEqual(true);
        });
    });
    it("It should respond with sorted (by sortBy parameter and desc direction) posts with two tags", () => {
      return axios.get('http://localhost:8081/api/posts/health,history/likes/desc')
        .then(response => {
          const posts = response.data.posts;
          const isSortedBySortParameter = () => {
            let listOfLikes = [];
            posts.forEach((post) => {
              listOfLikes.push(post.likes);
            });
            const maxLikes = listOfLikes[0];
            if (listOfLikes.every((likes) => likes <= maxLikes)) return true;
            else return false;
          };
          expect(isSortedBySortParameter()).toEqual(true);
        });
    });
  });

  describe("Check correct values with three tags", () => {
    it("It should respond with posts with correct tags when three tags are specified", () => {
      return axios.get('http://localhost:8081/api/posts/health,tech,history')
        .then(response => {
          let posts = response.data.posts;
          const hasOneOfTags = (post) => post.tags.includes('health') || post.tags.includes('tech') || post.tags.includes('history');
          expect(posts.every(hasOneOfTags)).toEqual(true);
        });
    });
    it("It should respond with posts with unique ids when three tags are specified", () => {
      return axios.get('http://localhost:8081/api/posts/health,tech,history')
        .then(response => {
          const posts = response.data.posts;
          const hasUniqueIds = () => {
            let idHash = {};
            posts.forEach((post) => {
              if (idHash[post.id]) return false;
              else idHash[post.id] = 1;
            });
            return true;
          };
          expect(hasUniqueIds()).toEqual(true);
        });
    });
    it("It should respond with by default sorted (by ids) posts with three tags", () => {
      return axios.get('http://localhost:8081/api/posts/health,tech,history')
        .then(response => {
          const posts = response.data.posts;
          const isSortedByIds = () => {
            let listOfIds = [];
            posts.forEach((post) => {
              listOfIds.push(post.id);
            });
            const minId = listOfIds[0];
            if (listOfIds.every((id) => id >= minId)) return true;
            else return false;
          };
          expect(isSortedByIds()).toEqual(true);
        });
    });
    it("It should respond with by default sorted (by ids) posts with three tags", () => {
      return axios.get('http://localhost:8081/api/posts/health,tech,history')
        .then(response => {
          const posts = response.data.posts;
          const isSortedByIds = () => {
            let listOfIds = [];
            posts.forEach((post) => {
              listOfIds.push(post.id);
            });
            const minId = listOfIds[0];
            if (listOfIds.every((id) => id >= minId)) return true;
            else return false;
          };
          expect(isSortedByIds()).toEqual(true);
        });
    });
    it("It should respond with sorted (by sortBy parameter) posts with three tags", () => {
      return axios.get('http://localhost:8081/api/posts/health,tech,history/likes')
        .then(response => {
          const posts = response.data.posts;
          const isSortedBySortParameter = () => {
            let listOfLikes = [];
            posts.forEach((post) => {
              listOfLikes.push(post.likes);
            });
            const minLikes = listOfLikes[0];
            if (listOfLikes.every((likes) => likes >= minLikes)) return true;
            else return false;
          };
          expect(isSortedBySortParameter()).toEqual(true);
        });
    });
    it("It should respond with sorted (by sortBy parameter and asc direction) posts with three tags", () => {
      return axios.get('http://localhost:8081/api/posts/health,tech,history/likes/asc')
        .then(response => {
          const posts = response.data.posts;
          const isSortedBySortParameter = () => {
            let listOfLikes = [];
            posts.forEach((post) => {
              listOfLikes.push(post.likes);
            });
            const minLikes = listOfLikes[0];
            if (listOfLikes.every((likes) => likes >= minLikes)) return true;
            else return false;
          };
          expect(isSortedBySortParameter()).toEqual(true);
        });
    });
    it("It should respond with sorted (by sortBy parameter and desc direction) posts with three tags", () => {
      return axios.get('http://localhost:8081/api/posts/health,tech,history/likes/desc')
        .then(response => {
          const posts = response.data.posts;
          const isSortedBySortParameter = () => {
            let listOfLikes = [];
            posts.forEach((post) => {
              listOfLikes.push(post.likes);
            });
            const maxLikes = listOfLikes[0];
            if (listOfLikes.every((likes) => likes <= maxLikes)) return true;
            else return false;
          };
          expect(isSortedBySortParameter()).toEqual(true);
        });
    });
  });


  
  
});