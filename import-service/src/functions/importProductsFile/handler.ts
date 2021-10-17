import "source-map-support/register";
import * as AWS from "aws-sdk";
import { middyfy } from "../../libs/lambda";
import { formatJSONResponse } from "../../libs/apiGateway";

export const importProductsFile = async (event) => {
  const catalogName = event.queryStringParameters.name;
  const catalogPath = `uploaded/${catalogName}`;
  const s3 = new AWS.S3({ region: "eu-west-1" });
  const BUCKET = "import-service-aws";
  const params = {
    Bucket: BUCKET,
    Key: catalogPath,
    Expires: 60,
    ContentType: "text/csv",
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl("putObject", params, (error, url) => {
      if (error) {
        return reject(error);
      }
      resolve(formatJSONResponse(url));
    });
  });
};

export const main = middyfy(importProductsFile);
