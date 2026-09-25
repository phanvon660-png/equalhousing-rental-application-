exports.handler = async function (event) {
// Only accept POST requests
if (event.httpMethod !== “POST”) {
return {
statusCode: 405,
headers: {
“Content-Type”: “application/json”
},
body: JSON.stringify({
success: false,
message: “Method not allowed”
})
};
}

try {
const contentType =
event.headers[“content-type”] ||
event.headers[“Content-Type”] ||
“”;

let data = {};
// Handle JSON submissions
if (contentType.includes("application/json")) {
  data = JSON.parse(event.body || "{}");
}
// Handle the URL-encoded submission from index.html
else if (
  contentType.includes("application/x-www-form-urlencoded")
) {
  const params = new URLSearchParams(event.body || "");
  for (const [key, value] of params.entries()) {
    data[key] = value;
  }
}
// Handle multipart/form-data as a fallback
else if (contentType.includes("multipart/form-data")) {
  const params = new URLSearchParams(event.body || "");
  for (const [key, value] of params.entries()) {
    data[key] = value;
  }
}
else {
  // Try URL-encoded data as a final fallback
  const params = new URLSearchParams(event.body || "");
  for (const [key, value] of params.entries()) {
    data[key] = value;
  }
}
// Identify the application
const applicationType =
  data.applicationType || "rental";
// Create a unique application number
const prefix =
  applicationType === "rental"
    ? "RENT"
    : applicationType === "cleaner"
    ? "CLEAN"
    : applicationType === "handyman"
    ? "HANDY"
    : applicationType === "deposit_receipt"
    ? "DEP"
    : "APP";
const timestamp = new Date()
  .toISOString()
  .replace(/[-:TZ.]/g, "")
  .slice(0, 14);
const randomCode = Math.random()
  .toString(36)
  .substring(2, 8)
  .toUpperCase();
const applicationId =
  prefix +
  "-" +
  timestamp +
  "-" +
  randomCode;
// Prepare the response
return {
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  },
  body: JSON.stringify({
    success: true,
    applicationId: applicationId,
    applicationType: applicationType,
    message:
      "Your rental application has been submitted successfully."
  })
};

} catch (error) {
console.error(“Application submission error:”, error);

return {
  statusCode: 500,
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    success: false,
    message:
      "There was a problem processing your application."
  })
};

}
};