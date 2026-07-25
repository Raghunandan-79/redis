import express from "express";
import { emailQueue } from "./queue";

const app = express();
app.use(express.json());

app.post("/welcome-email", async (req, res) => {
  const job = emailQueue.add(
    "Send-welcome-email",
    {
      to: req.body.to,
      subject: req.body.subject || "Learner",
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      
      removeOnComplete: true,
    },
  );

  res.json({
    message: "Welcome email job added to the queue!",
    jobId: (await job).id
  })
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
