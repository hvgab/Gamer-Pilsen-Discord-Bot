const Axios = require("axios");
const { EROFS } = require("constants");
const FormData = require("form-data");
const fs = require("fs");
const fsp = require("fs").promises;
const Path = require("path");
const secrets = require("../secrets.json");

/* Upload images to imgbb, discord prefers not to get attachments. */

uploadsFilePath = "./imgbb-uploads.json";

async function upload(imagePath, imageFilename, name = null) {
	const url = "https://api.imgbb.com/1/upload";

	console.log("upload imagePath", imagePath);
	console.log("upload imageFilename", imageFilename);
	console.log("upload name", name);
	console.log("upload key", secrets.imgbbKey);

	console.debug("making form");
	const form = new FormData();
	form.append("key", secrets.imgbbKey);
	form.append("image", fs.createReadStream(imagePath), {
		filename: imageFilename,
		contentType: "image/gif",
	});
	if (name != null) {
		console.log(`sending with name ${name}`);
		form.append("name", `${name}`);
	}
	console.debug("made form");

	console.debug("Posting to ImgBB");
	const response = await Axios.post(url, form, {
		headers: form.getHeaders(),
	});
	console.debug("Posted to ImgBB");

	console.log(`${response.status} ${response.statusText}`);
	return response.data;
}

async function saveToUploads(imgbbResponse) {
	// Cache the upload to json, get same url next time.
	let imgbbUploads;
	// open file
	try {
		imgbbUploadsFile = await fsp.readFile("./libs/imgbb-uploads.json", "utf8");
		imgbbUploads = JSON.parse(imgbbUploadsFile);
		console.log(imgbbUploads);
	} catch (error) {
		console.error("Could not open file", error);
		return;
	}
	console.log("typeof imgbbUploads: ", typeof imgbbUploads);
	console.log("imgbbUploads: ", imgbbUploads);

	// add img to list
	imgbbUploads.push(digte);
	console.log("pushed data to imgbbUploads");
	console.log("imgbbUploads: ", imgbbUploads);

	// save file
	const saveData = JSON.stringify(imgbbUploads, null, 2);
	try {
		await fsp.writeFile("./libs/imgbb-uploads.json", saveData, "utf8");
	} catch (error) {
		console.error("Could not save data to file error", error);
	}
}

async function saveTest() {
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

// saveTest();

exports.upload = upload;
