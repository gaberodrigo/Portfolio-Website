import { NextRequest, NextResponse } from "next/server";
import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

const client = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION || "us-west-2",
});

export async function POST(req: NextRequest) {
  try {
    const kbId = process.env.BEDROCK_KB_ID;
    const modelArn = process.env.BEDROCK_MODEL_ARN;
    if (!kbId?.trim()) {
      return NextResponse.json(
        { error: "Server misconfiguration: BEDROCK_KB_ID is not set." },
        { status: 400 },
      );
    }
    if (!modelArn?.trim()) {
      return NextResponse.json(
        { error: "Server misconfiguration: BEDROCK_MODEL_ARN is not set." },
        { status: 400 },
      );
    }

    const { message, sessionId } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const command = new RetrieveAndGenerateCommand({
      input: {
        text: message,
      },
      retrieveAndGenerateConfiguration: {
        type: "KNOWLEDGE_BASE",
        knowledgeBaseConfiguration: {
          knowledgeBaseId: kbId,
          modelArn,
        },
      },
      sessionId: sessionId || undefined,
    });

    const response = await client.send(command);

    const citations =
      response.citations?.map((c) => ({
        generatedText: c.generatedResponsePart?.textResponsePart?.text,
        references:
          c.retrievedReferences?.map((r) => ({
            text: r.content?.text,
            location: r.location,
            metadata: r.metadata,
          })) || [],
      })) || [];

    return NextResponse.json({
      answer: response.output?.text ?? "",
      sessionId: response.sessionId,
      citations,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to query knowledge base." },
      { status: 500 },
    );
  }
}
