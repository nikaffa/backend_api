const expect = require('@jest/globals').expect;
// const app = require("../src/app");
// const request = require('request');
// const request = require("supertest");
const axios = require('axios');

describe("GET /api/ping (Step 1)", () => {
  it("It should respond with status code 200", () => {
    return axios.get('http://localhost:8081/api/ping')
      .then(res => {
        //console.log('res', res.status);
        expect(res.status).toBe(200);
      });
  });
  it("It should respond with body { success: true }", () => {
    return axios.get('http://localhost:8081/api/ping')
      .then(res => {
        expect(res.data).toEqual({ "success": true });
      });
  });
});