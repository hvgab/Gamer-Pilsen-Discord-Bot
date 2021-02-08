const { TestScheduler } = require("jest");
const tlApi = require("../libs/telialigaenApi");

test("Retrieve Seasons from Api", async () => {
	const seasons = await tlApi.getSeasons();
	const season = seasons[0];
	expect(seasons.length).toBeGreaterThan(1);
	expect(season).toHaveProperty("active");
	expect(season).toHaveProperty("product.id");
	expect(season).toHaveProperty("divisions.0.id");
	expect(season).toHaveProperty("id");
	expect(season).toHaveProperty("name");
	expect(season).toHaveProperty("status");
});

test("Retrieve Seasons from Api", async () => {
	const seasons = await tlApi.getSeasons();
	const season = seasons[0];
	expect(seasons.length).toBeGreaterThan(1);
	expect(season).toHaveProperty("id");
	expect(season).toHaveProperty("name");
	expect(season).toHaveProperty("status");
	expect(season).toHaveProperty("product");
	expect(season).toHaveProperty("divisions");
	expect(season).toHaveProperty("active");
});
