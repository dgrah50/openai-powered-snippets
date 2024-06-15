import { OpenAIApi, Configuration } from "openai";

/**
 * @type {Configuration | undefined}
 */
let configuration: Configuration | undefined;

/**
 * @type {OpenAIApi | undefined}
 */
let openai: OpenAIApi | undefined;

const models = {
  GPT: "gpt-4o",
  DAVINCI: "text-davinci-003",
};

let model = models.GPT;

export class OpenAIAnswer {
  code: string;
  fullText: string;

  constructor(fullText: string) {
    this.code = fullText + "\n";
    this.fullText = fullText + "\n";
  }
}

export function setOpenAIApiKey(apiKey: string) {
  try {
    configuration = new Configuration({ apiKey });
    openai = new OpenAIApi(configuration);
  } catch (error) {
    console.error("Failed to set OpenAI API key:", error);
  }
}

export function setOpenAIModel(openAIModel: string) {
  if (Object.values(models).includes(openAIModel)) {
    model = openAIModel;
  } else {
    console.error("Invalid OpenAI model:", openAIModel);
  }
}

/**
 * @param {string} prompt
 * @returns {Promise<OpenAIAnswer | undefined>}
 */
export async function askToOpenAIDavinci(
  prompt: string
): Promise<OpenAIAnswer | undefined> {
  if (!openai) {
    console.error("OpenAI API is not initialized. Call setOpenAIApiKey first.");
    return;
  }
  try {
    const response = await openai.createCompletion({
      model: models.DAVINCI,
      prompt: prompt,
      temperature: 0,
      max_tokens: 2048,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    return new OpenAIAnswer(response.data.choices[0].text);
  } catch (error) {
    console.error("Error while querying Davinci model:", error);
  }
}

/**
 * @param {string} prompt
 * @returns {Promise<OpenAIAnswer | undefined>}
 */
export async function askToOpenAIGPT(
  prompt: string
): Promise<OpenAIAnswer | undefined> {
  if (!openai) {
    console.error("OpenAI API is not initialized. Call setOpenAIApiKey first.");
    return;
  }
  try {
    const response = await openai.createChatCompletion({
      model: model, // Now reading model from the configuration
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
    });
    return new OpenAIAnswer(response.data.choices[0].message.content);
  } catch (error) {
    console.error("Error while querying GPT model:", error);
  }
}

export default async function askToOpenAI(
  prompt: string
): Promise<OpenAIAnswer | undefined> {
  if (model === models.DAVINCI) {
    return await askToOpenAIDavinci(prompt);
  } else {
    return await askToOpenAIGPT(prompt);
  }
}
