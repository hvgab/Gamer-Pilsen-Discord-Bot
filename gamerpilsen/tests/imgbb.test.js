const Imgbb = require("../libs/Imgbb.js");

test("Imgbb upload returns 200", async () => {
	const filename = "Gabbeh_0547_trigger.gif";
	const path =
		"F:\\DEV\\gamerpilsen-discord-bot\\resources\\images\\Gabbeh-0547-Triggered.gif";
	const resp = await Imgbb.upload(path, filename);
	expect(resp.status).toBe(200);
	expect(resp).toHaveProperty("data.id");
	expect(resp).toHaveProperty("data.title");
	expect(resp).toHaveProperty("data.url_viewer");
	expect(resp).toHaveProperty("data.image.filename");
	expect(resp).toHaveProperty("data.image.name");
	expect(resp).toHaveProperty("data.image.url");
});
