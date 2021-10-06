import "source-map-support/register";

import { middyfy } from "../../libs/lambda";
import { formatJSONResponse } from "../../libs/apiGateway";
import { SNS } from "aws-sdk";
import { postProduct } from "../../helpers/postProduct";

export const catalogBatchProcess = async (event) => {
  try {
    for (const record of event.Records) {
      const sns = new SNS({});
      const { title, description, price, count } = JSON.parse(record.body);
      if (title && description && price && count) {
        const productResult = await postProduct(
          title,
          description,
          price,
          count
        );
        console.log("Product created in DB:", productResult);
        sns.publish(
          {
            Subject: "Subject",
            Message: title,
            MessageAttributes: {
              price: {
                DataType: "Number",
                StringValue: price,
              },
            },
            TopicArn: process.env.SNS_ARN,
          },
          () => {
            console.log("Email was sent for: ", {
              title,
              description,
              price,
              count,
            });
          }
        );
      }
    }
    const response = event.Records.map((record) => {
      return JSON.parse(record["body"]);
    });

    return formatJSONResponse(response);
  } catch (error) {
    console.log(error);
  }
};

export const main = middyfy(catalogBatchProcess);
