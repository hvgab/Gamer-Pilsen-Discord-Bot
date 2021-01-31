const Axios = require("axios");
const { EROFS } = require("constants");
const FormData = require("form-data");
const fs = require("fs");
const Path = require("path");
const secrets = require("../secrets.json");

class ImgBB {
	uploadsFilePath = "./imgbb-uploads.json";

	static async upload(image, name) {
		// image{filename, path}

		const url = "https://api.imgbb.com/1/upload";

		console.log("upload img", image);
		console.log("upload name", name);
		console.log("upload key", secrets.imgbbKey);

		console.debug("making form");
		const form = await new FormData();
		form.append("key", secrets.imgbbKey);
		form.append("image", fs.createReadStream(image.path));
		form.append("name", `${name}`);
		console.debug("made form");

		console.debug("Posting to ImgBB");
		const response = await Axios.post(url, form, {
			headers: form.getHeaders(),
		});
		console.debug("Posted to ImgBB");
		// Axios.post(url, form, { headers: form.getHeaders() })
		// 	.then((response) => {
		// 		console.log(response.data);
		// 	})
		// 	.catch((error) => {
		// 		console.log(error);
		// 	});

		console.log(`${response.status} ${response.statusText}`);
		console.log(response.data);

		console.log("cache response");

		this.saveToUploads(response.data);

		return response.data;
		// open json file, append, save
	}

	static saveToUploads(imgbbResponse) {
		console.log("read uploads file");
		const uploads = fs.readFileSync(this.uploadsFilePath);
		console.log(uploads);
		console.log(typeof uploads);

		uploads.push(imgbbResponse);
		console.log("pushed new response");
		fs.writeFileSync(this.uploadsFilePath, uploads);
		console.log("wrote to file");
	}
}

function saveTest(){
  const digte = {
		data: {
			id: "R94qvM8",
			title: "Gabbeh-Triggered",
			url_viewer: "https://ibb.co/R94qvM8",
			url: "https://i.ibb.co/HVpjFMZ/Gabbeh-Triggered.gif",
			display_url: "https://i.ibb.co/HVpjFMZ/Gabbeh-Triggered.gif",
			size: 234665,
			time: "1612123942",
			expiration: "0",
			image: {
				filename: "Gabbeh-Triggered.gif",
				name: "Gabbeh-Triggered",
				mime: "image/gif",
				extension: "gif",
				url: "https://i.ibb.co/HVpjFMZ/Gabbeh-Triggered.gif",
			},
			thumb: {
				filename: "Gabbeh-Triggered.gif",
				name: "Gabbeh-Triggered",
				mime: "image/gif",
				extension: "gif",
				url: "https://i.ibb.co/R94qvM8/Gabbeh-Triggered.gif",
			},
			delete_url: "https://ibb.co/R94qvM8/ace1ffd46ec4e443b330aebffff3f934",
		},
		success: true,
		status: 200,
  };
  
}

function ftest() {
	const img = {
		filename: "Gabbeh_0547_trigger.gif",
		path:
			"F:\\DEV\\gamerpilsen-discord-bot\\resources\\images\\Gabbeh_0547_trigger.gif",
	};

	const response = ImgBB.upload(img, "GabbehTriggered");
	console.log(response);
	return response;
}
ftest();

exports.ImgBB = ImgBB;
