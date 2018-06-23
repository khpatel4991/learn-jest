import {
  makeGlobalDatabase,
  cleanUpDatabase,
} from "./database";

let db;
const MOCK_THING = {
  name: "Hello Jest",
};

describe("Database Sanity", () => {

  beforeAll(async () => {
    db = await makeGlobalDatabase();
    await db.delete("Thing")
  });

  describe("Can Insert Thing", () => {
    test("return truthy value(id) on save", async () => {
      const thing = await db.insert("Thing", MOCK_THING);
      expect(thing).toBeTruthy();
    });
  });

  describe("Can Find Things", () => {
    test("return all things", async () => {
      const things = await db.find("Thing");
      expect(things.length).toBeGreaterThan(0);
    });
  });

  afterAll(async () => {
    await db.close();
  });

});