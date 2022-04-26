function generateSignature(callback, params_to_sign) {
  axios
    .get("/cloudinary/sign", {
      params: {
        params_to_sign,
      },
    })
    .then(function (response) {
      callback(response.data);
    });
}

var myWidget = cloudinary.createUploadWidget(
  {
    cloudName: "{{cloudinaryName}}",
    apiKey: "{{cloudinaryApiKey}}",
    uploadPreset: "{{cloudinaryPreset}}",
    uploadSignature: generateSignature,
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      console.log("Done! Here is the image info: ", result.info);

      document.querySelector("#upload_widget").style.display = "none";
      document.querySelector("#id_image_url").value = result.info.url;
      document.querySelector("#uploaded_image").src = result.info.url;
      document.querySelector("#uploaded_image").style.display = "inline";
    }
  }
);

document.getElementById("upload_widget").addEventListener(
  "click",
  function () {
    myWidget.open();
  },
  false
);
