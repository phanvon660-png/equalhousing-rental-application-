exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: false,
        message: "Method not allowed"
      })
    };
  }

  try {
    const contentType = event.headers["content-type"] || "";
    let data = {};

    if (contentType.includes("application/json")) {
      data = JSON.parse(event.body || "{}");
    } else {
      const params = new URLSearchParams(event.body || "");

      for (const [key, value] of params.entries()) {
        data[key] = value;
      }
    }

    const applicationType = data.applicationType || "rental";

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
      new Date()
        .toISOString()
        .replace(/[-:TZ.]/g, "")
        .slice(0, 14) +
      "-" +
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

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
    console.error("Submission error:", error);

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