exports.handler = async function (event) {
  // Only accept POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        message: "Method not allowed"
      })
    };
  }

  try {
    const contentType = event.headers["content-type"] || "";

    // Receive JSON from the website
    let data = {};

    if (contentType.includes("application/json")) {
      data = JSON.parse(event.body || "{}");
    } else {
      data = JSON.parse(event.body || "{}");
    }

    const applicationType = data.applicationType || "unknown";

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

    const applicationId =
      prefix +
      "-" +
      new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14) +
      "-" +
      Math.random().toString(36).substring(2, 8).toUpperCase();

    // For now, return the application number.
    // We will connect permanent storage/email after testing the submission.
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: true,
        applicationId: applicationId,
        applicationType: applicationType,
        message: "Application received successfully."
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: false,
        message: "There was a problem processing the application."
      })
    };
  }
};