const Axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const fsp = require("fs").promises;
const secrets = require("../secrets.json");

/* Upload images to imgbb, discord prefers not to get attachments. */

async function upload(imagePath, imageFilename, name = null) {
	const url = "https://api.imgbb.com/1/upload";

	console.log("upload imagePath", imagePath);
	console.log("upload imageFilename", imageFilename);
	console.log("upload name", name);
	console.log("upload key", secrets.imgbbKey);

	console.debug("making form");
	let form = new FormData();
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
	saveToUploads(response.data);
	return response.data;
}

async function saveToUploads(imgbbResponseData) {
	// Cache the upload to json, get same url next time.
	let imgbbUploads;
	// open file
	try {
		let imgbbUploadsFile = await fsp.readFile(
			"./libs/imgbb-uploads.json",
			"utf8"
		);
		// console.log("imgbbUploadsFile", imgbbUploadsFile);
		imgbbUploads = JSON.parse(imgbbUploadsFile);
		console.log("imgbbUploads length ", imgbbUploads.length);
	} catch (error) {
		console.error("Could not open file", error);
		return;
	}

	// if id not in json:
	// add img to list
	imgbbUploads.push(imgbbResponseData);
	console.log("pushed data to imgbbUploads");
	console.log("imgbbUploads length ", imgbbUploads.length);

	// save file
	const saveData = JSON.stringify(imgbbUploads, null, 2);
	try {
		await fsp.writeFile("./libs/imgbb-uploads.json", saveData, "utf8");
	} catch (error) {
		console.error("Could not save data to file error", error);
	}
}

async function testSave() {
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

	saveToUploads(digte);
}

async function testUpload() {
	imgPath = "../resources/images/Fixion-0658-Triggered.gif";
	imgName = "Fixion-0658-Triggered.gif";
	upload(imgPath, imgName);
}

// saveTest();
// testUpload();

exports.upload = upload;
