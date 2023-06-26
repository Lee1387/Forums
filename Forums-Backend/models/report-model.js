import mongoose from "mongoose";
const { Schema, model } = mongoose;

const reportSchema = new Schema(
    {
        messageId: {
            type: String,
            required: true,
        },
        messageType: {
            type: String,
            required: true,
        },
        reportedBy: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Report = model("Report", reportSchema);

export { Report, reportSchema };