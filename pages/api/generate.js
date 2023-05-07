import { Configuration, OpenAIApi } from "openai";
import { checkIfUserIsLoggedIn } from '../components/jwt';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  // 检查用户是否已经登录
  const isLoggedIn = checkIfUserIsLoggedIn(req);
  if (!isLoggedIn) {
    res.status(401).json({
      error: {
        message: "Unauthorized: Please login to access this resource.",
      },
    });
    return;
  }

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const messages = req.body.messages || [];
  if (typeof messages !== 'object') {
    res.status(400).json({
      error: {
        message: "Please enter a valid content",
      }
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 1,
    });

    res.status(200).json({ result: completion.data.choices[0].message?.content });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

