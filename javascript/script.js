if ("launchQueue" in window) {
  launchQueue.setConsumer(async (launchParams) => {
    if (!launchParams.files.length) return;

    const fileHandle = launchParams.files[0];
    const file = await fileHandle.getFile();

    const text = await file.text();

    console.log(text);
  });
}

const params = new URLSearchParams(location.search);

const page = params.get("action");

switch (page) {
  case "settings":
    console.log("Open settings");
    break;

  case "open":
    console.log("Open profile");
    break;
}
